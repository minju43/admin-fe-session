/*
교육용 개인 블로그 JavaScript
Vanilla JS를 활용한 동적 기능 구현
*/

// DOM이 로드된 후 실행
document.addEventListener('DOMContentLoaded', function () {
    console.log('개인 블로그가 로드되었습니다!');

    // 초기화 함수들 호출
    initSmoothScrolling();
    initScrollAnimations();
    initNavbarScrollEffect();
    initTypingEffect();
    initCardHoverEffects();
    initFormValidation();
    initThemeToggle();
});

/**
 * 부드러운 스크롤 기능
 * 네비게이션 링크 클릭 시 해당 섹션으로 부드럽게 이동
 */
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // 네비게이션 바 높이 고려

                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });

                // 모바일에서 네비게이션 메뉴 닫기
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse.classList.contains('show')) {
                    const navbarToggler = document.querySelector('.navbar-toggler');
                    navbarToggler.click();
                }
            }
        });
    });
}

/**
 * 스크롤 애니메이션 효과
 * 요소가 화면에 나타날 때 fade-in 효과 적용
 */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // 애니메이션을 적용할 요소들 선택
    const animateElements = document.querySelectorAll('.card, .hero-content, .profile-card, .contact-item');

    animateElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

/**
 * 네비게이션 바 스크롤 효과
 * 스크롤할 때 네비게이션 바 배경 투명도 변경
 */
function initNavbarScrollEffect() {
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', function () {
        const scrollTop = window.pageYOffset;

        if (scrollTop > 100) {
            navbar.style.backgroundColor = 'rgba(13, 110, 253, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.style.backgroundColor = '';
            navbar.style.backdropFilter = '';
        }
    });
}

/**
 * 타이핑 효과
 * 메인 제목에 타이핑 애니메이션 적용
 */
function initTypingEffect() {
    const typingElement = document.querySelector('.hero-content h1');
    if (!typingElement) return;

    const originalText = typingElement.textContent;
    typingElement.textContent = '';

    let i = 0;
    const typingSpeed = 100;

    function typeWriter() {
        if (i < originalText.length) {
            typingElement.textContent += originalText.charAt(i);
            i++;
            setTimeout(typeWriter, typingSpeed);
        }
    }

    // 페이지 로드 후 1초 뒤에 타이핑 시작
    setTimeout(typeWriter, 1000);
}

/**
 * 카드 호버 효과 강화
 * 카드에 마우스 오버 시 추가 효과 적용
 */
function initCardHoverEffects() {
    const cards = document.querySelectorAll('.hover-card');

    cards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

/**
 * 폼 검증 (연락처 폼이 있다면)
 * 이메일, 전화번호 형식 검증
 */
function initFormValidation() {
    // 연락처 폼이 있다면 검증 로직 추가
    const contactForm = document.querySelector('#contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const email = this.querySelector('#email');
        const phone = this.querySelector('#phone');

        if (validateEmail(email.value) && validatePhone(phone.value)) {
            showNotification('메시지가 성공적으로 전송되었습니다!', 'success');
            this.reset();
        } else {
            showNotification('입력 정보를 확인해주세요.', 'error');
        }
    });
}

/**
 * 테마 토글 기능 (다크모드)
 * 사용자 선호도에 따른 테마 변경
 */
function initThemeToggle() {
    // 테마 토글 버튼이 있다면
    const themeToggle = document.querySelector('#themeToggle');
    if (!themeToggle) return;

    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);

    themeToggle.addEventListener('click', function () {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);

        this.innerHTML = newTheme === 'dark' ? '<i class="bi bi-sun"></i>' : '<i class="bi bi-moon"></i>';
    });
}

/**
 * 특정 섹션으로 스크롤 이동 (외부에서 호출용)
 * @param {string} sectionId - 이동할 섹션의 ID
 */
function scrollToSection(sectionId) {
    const targetSection = document.querySelector(sectionId);
    if (targetSection) {
        const offsetTop = targetSection.offsetTop - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}


/**
 * 알림 메시지 표시
 * @param {string} message - 표시할 메시지
 * @param {string} type - 메시지 타입 (success, error, info, warning)
 */
function showNotification(message, type = 'info') {
    // 기존 알림이 있다면 제거
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;

    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    document.body.appendChild(notification);

    // 5초 후 자동 제거
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

/**
 * 이메일 형식 검증
 * @param {string} email - 검증할 이메일 주소
 * @returns {boolean} - 유효한 이메일인지 여부
 */
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * 전화번호 형식 검증
 * @param {string} phone - 검증할 전화번호
 * @returns {boolean} - 유효한 전화번호인지 여부
 */
function validatePhone(phone) {
    const phoneRegex = /^010-\d{4}-\d{4}$/;
    return phoneRegex.test(phone);
}

/**
 * 페이지 로딩 상태 표시
 */
// 제거된 유틸 함수들: showLoading, hideLoading, getRandomColor, initScrollProgress

/**
 * 키보드 접근성 개선
 * Tab 키로 네비게이션 시 포커스 표시
 */
document.addEventListener('keydown', function (e) {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', function () {
    document.body.classList.remove('keyboard-navigation');
});

// 키보드 네비게이션 스타일
const keyboardStyle = document.createElement('style');
keyboardStyle.textContent = `
    .keyboard-navigation *:focus {
        outline: 2px solid #007bff !important;
        outline-offset: 2px !important;
    }
`;
document.head.appendChild(keyboardStyle);

// 페이지 성능 모니터링 (개발용)
if (window.performance && window.performance.timing) {
    window.addEventListener('load', function () {
        setTimeout(function () {
            const timing = window.performance.timing;
            const loadTime = timing.loadEventEnd - timing.navigationStart;
            console.log(`페이지 로딩 시간: ${loadTime}ms`);
        }, 0);
    });
}
