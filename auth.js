function login() {
    const usernameOrEmail = document.getElementById('usernameOrEmail').value.trim();
    const password = document.getElementById('password').value.trim();
    const rememberMe = document.getElementById('rememberMe').checked;

    if (!usernameOrEmail || !password) {
        showError('يرجى ملء جميع الحقول!');
        return;
    }

    fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ usernameOrEmail, password, rememberMe })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const user = data.user;

            if (rememberMe) {
                localStorage.setItem('currentUser', JSON.stringify(user));
            } else {
                sessionStorage.setItem('currentUser', JSON.stringify(user));
            }

            currentUser = user;
            document.getElementById('welcomeUsername').innerText = user.firstName;
            updatePointsDisplay();
            showPage('welcomePage');
            showWelcomeMessage();
            completeLoginTask(); // إكمال مهمة تسجيل الدخول اليومي
        } else {
            showError('اليوزر نيم/الإيميل أو كلمة السر غير صحيحة!');
        }
    })
    .catch(error => {
        console.error('Error logging in:', error);
        showError('حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.');
    });
}

function register() {
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const newUsername = document.getElementById('newUsername').value.trim();
    const email = document.getElementById('email').value.trim();
    const newPassword = document.getElementById('newPassword').value.trim();
    const recoveryPassword = document.getElementById('recoveryPassword').value.trim();

    if (!firstName || !lastName || !newUsername || !email || !newPassword || !recoveryPassword) {
        showError('يرجى ملء جميع الحقول!');
        return;
    }

    fetch('/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ firstName, lastName, username: newUsername, email, password: newPassword, recoveryPassword })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            Swal.fire({
                icon: 'success',
                title: 'تم إنشاء الحساب بنجاح!',
                showConfirmButton: false,
                timer: 1500
            });
            showPage('loginPage');
        } else {
            showError(data.message);
        }
    })
    .catch(error => console.error('Error registering:', error));
}