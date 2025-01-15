<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>تسجيل الدخول</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <style>
        body {
            background-image: url('https://i.imgur.com/efoUOgy.jpeg');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            font-family: 'Tajawal', sans-serif;
            color: white;
        }
        .custom-button {
            background-color: #3E2723;
            color: white;
            font-size: 1.25rem;
            font-weight: bold;
            padding: 12px 24px;
            border-radius: 8px;
            transition: transform 0.2s, box-shadow 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .custom-button:hover {
            transform: scale(1.05);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        .custom-button i {
            margin-left: 8px;
        }
        .idea-card {
            background-color: rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 16px;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        .idea-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        .loading-spinner {
            border: 4px solid rgba(0, 0, 0, 0.1);
            border-left-color: #3E2723;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            animation: spin 1s linear infinite;
        }
        @keyframes spin {
            to {
                transform: rotate(360deg);
            }
        }
        .toast {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: #3E2723;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            z-index: 1000;
            animation: slideIn 0.5s ease-out;
        }
        .toast.success {
            background-color: #4CAF50;
        }
        .toast.error {
            background-color: #F44336;
        }
        @keyframes slideIn {
            from {
                transform: translateX(100%);
            }
            to {
                transform: translateX(0);
            }
        }
        .fade-in {
            animation: fadeIn 0.5s ease-in;
        }
        @keyframes fadeIn {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }
        .game-cell {
            width: 100px;
            height: 100px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2rem;
            font-weight: bold;
            border: 2px solid #fff;
            cursor: pointer;
        }
        .game-cell:hover {
            background-color: rgba(255, 255, 255, 0.1);
        }
    </style>
    <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700&display=swap" rel="stylesheet">
</head>
<body class="flex items-center justify-center h-screen text-white">
    <!-- عرض النقاط في الأعلى اليسار -->
    <div id="pointsDisplay" class="fixed top-4 left-4 bg-gray-800 p-2 rounded-lg text-sm hidden">
        <i class="fas fa-coins mr-2"></i>
        <span id="pointsCount">0</span> نقاط
    </div>

    <div id="welcomeMessage" class="fixed bottom-4 right-4 text-xs hidden">
        <p id="welcomeText">مرحبًا، <span id="welcomeUsername"></span></p>
        <p id="loginSuccessText" class="text-xs mt-1">تم تسجيل الدخول بنجاح</p>
    </div>

    <div id="notificationArea" class="fixed top-4 right-4 space-y-2"></div>

    <div class="w-96 relative mt-48">
        <!-- صفحة تسجيل الدخول -->
        <div id="loginPage" class="space-y-4 mt-16 fade-in">
            <h1 class="text-2xl font-bold mb-4 text-center">تسجيل الدخول</h1>
            <div class="flex items-center space-x-2">
                <i class="fas fa-user text-gray-300"></i>
                <input type="text" id="usernameOrEmail" placeholder="اليوزر نيم أو الإيميل" class="w-full p-1 border rounded text-black">
            </div>
            <div class="flex items-center space-x-2">
                <i class="fas fa-lock text-gray-300"></i>
                <div class="relative flex-1">
                    <input type="password" id="password" placeholder="كلمة السر" class="w-full p-1 border rounded pr-10 text-black">
                    <i class="fas fa-eye absolute right-3 top-2 cursor-pointer text-xs" onclick="togglePasswordVisibility('password')" style="width: 16px; color: #3E2723;" onmouseover="this.style.color='#5D4037'" onmouseout="this.style.color='#3E2723'"></i>
                </div>
            </div>
            <div class="flex items-center mb-4">
                <input type="checkbox" id="rememberMe" class="mr-2"> <span>تذكرني</span>
            </div>
            <button onclick="login()" class="w-full bg-green-500 text-white p-1 rounded hover:bg-green-600">تسجيل الدخول</button>
            <p class="mt-4 text-center">مستخدم جديد؟ <a href="#" onclick="showPage('registerPage')" class="text-blue-300">أنشئ حسابًا</a></p>
            <p class="text-center"><a href="#" onclick="showPage('forgotPasswordPage')" class="text-blue-300">نسيت كلمة السر؟</a></p>
            <p class="text-center"><a href="#" onclick="showPage('developerPage')" class="text-red-300">دخول المطورين</a></p>
        </div>

        <!-- صفحة إنشاء حساب -->
        <div id="registerPage" class="hidden space-y-4 mt-16 fade-in">
            <h1 class="text-2xl font-bold mb-4 text-center">إنشاء حساب</h1>
            <div class="flex space-x-4">
                <div class="flex items-center space-x-2 flex-1">
                    <i class="fas fa-user text-gray-300"></i>
                    <input type="text" id="firstName" placeholder="الاسم الأول" class="w-full p-1 border rounded text-black">
                </div>
                <div class="flex items-center space-x-2 flex-1">
                    <i class="fas fa-user text-gray-300"></i>
                    <input type="text" id="lastName" placeholder="الاسم الأخير" class="w-full p-1 border rounded text-black">
                </div>
            </div>
            <div class="flex space-x-4">
                <div class="flex items-center space-x-2 flex-1">
                    <i class="fas fa-at text-gray-300"></i>
                    <input type="text" id="newUsername" placeholder="اليوزر نيم" class="w-full p-1 border rounded text-black">
                </div>
                <div class="flex items-center space-x-2 flex-1">
                    <i class="fas fa-envelope text-gray-300"></i>
                    <input type="email" id="email" placeholder="الإيميل" class="w-full p-1 border rounded text-black">
                </div>
            </div>
            <div class="flex items-center space-x-2">
                <i class="fas fa-lock text-gray-300"></i>
                <div class="relative flex-1">
                    <input type="password" id="newPassword" placeholder="كلمة السر" class="w-full p-1 border rounded pr-10 text-black">
                    <i class="fas fa-eye absolute right-3 top-2 cursor-pointer text-xs" onclick="togglePasswordVisibility('newPassword')" style="width: 16px; color: #3E2723;" onmouseover="this.style.color='#5D4037'" onmouseout="this.style.color='#3E2723'"></i>
                </div>
            </div>
            <div class="flex items-center space-x-2">
                <i class="fas fa-lock text-gray-300"></i>
                <div class="relative flex-1">
                    <input type="password" id="recoveryPassword" placeholder="كلمة السر السرية (للاسترداد)" class="w-full p-1 border rounded pr-10 text-black">
                    <i class="fas fa-eye absolute right-3 top-2 cursor-pointer text-xs" onclick="togglePasswordVisibility('recoveryPassword')" style="width: 16px; color: #3E2723;" onmouseover="this.style.color='#5D4037'" onmouseout="this.style.color='#3E2723'"></i>
                </div>
            </div>
            <button onclick="register()" class="w-full bg-green-500 text-white p-1 rounded hover:bg-green-600">إنشاء حساب</button>
            <p class="mt-4 text-center">لديك حساب بالفعل؟ <a href="#" onclick="showPage('loginPage')" class="text-blue-300">سجل دخول</a></p>
        </div>

        <!-- صفحة نسيت كلمة السر -->
        <div id="forgotPasswordPage" class="hidden space-y-4 mt-16 fade-in">
            <h1 class="text-2xl font-bold mb-4 text-center">نسيت كلمة السر</h1>
            <div class="flex items-center space-x-2">
                <i class="fas fa-user text-gray-300"></i>
                <input type="text" id="forgotUsernameOrEmail" placeholder="اليوزر نيم أو الإيميل" class="w-full p-1 border rounded text-black">
            </div>
            <div class="flex items-center space-x-2">
                <i class="fas fa-lock text-gray-300"></i>
                <div class="relative flex-1">
                    <input type="password" id="forgotRecoveryPassword" placeholder="كلمة السر السرية" class="w-full p-1 border rounded pr-10 text-black">
                    <i class="fas fa-eye absolute right-3 top-2 cursor-pointer text-xs" onclick="togglePasswordVisibility('forgotRecoveryPassword')" style="width: 16px; color: #3E2723;" onmouseover="this.style.color='#5D4037'" onmouseout="this.style.color='#3E2723'"></i>
                </div>
            </div>
            <button onclick="resetPassword()" class="w-full bg-green-500 text-white p-1 rounded hover:bg-green-600">إعادة تعيين كلمة السر</button>
            <p class="mt-4 text-center"><a href="#" onclick="showPage('loginPage')" class="text-blue-300">العودة لتسجيل الدخول</a></p>
        </div>

        <!-- صفحة الترحيب -->
        <div id="welcomePage" class="hidden space-y-4 mt-16 fade-in">
            <h1 class="text-2xl font-bold mb-4 text-center">مرحبًا، <span id="welcomeUsername"></span>!</h1>
            <p class="mb-4 text-center text-sm">لقد سجلت دخولك بنجاح.</p>
            <div class="flex flex-wrap gap-4 justify-center">
                <button onclick="showPage('profilePage')" class="custom-button">
                    <i class="fas fa-user-circle text-sm"></i>
                    <span class="text-sm">التفاصيل الشخصية</span>
                </button>
                <button onclick="showPage('vizaPage')" class="custom-button">
                    <i class="fas fa-gift text-sm"></i>
                    <span class="text-sm">فيزات التفعيل</span>
                </button>
                <button onclick="showPage('videosPage')" class="custom-button">
                    <i class="fas fa-video text-sm"></i>
                    <span class="text-sm">فيديوهات الشرح</span>
                </button>
                <button onclick="showPage('challengePage')" class="custom-button">
                    <i class="fas fa-lightbulb text-sm"></i>
                    <span class="text-sm">تحدي الإبداع</span>
                </button>
                <button onclick="showPage('gamesPage')" class="custom-button">
                    <i class="fas fa-gamepad text-sm"></i>
                    <span class="text-sm">الألعاب</span>
                </button>
                <button onclick="showPage('pointsGuidePage')" class="custom-button">
                    <i class="fas fa-coins text-sm"></i>
                    <span class="text-sm">كيفية تجميع النقاط</span>
                </button>
                <button onclick="showPage('supportPage')" class="custom-button">
                    <i class="fas fa-headset text-sm"></i>
                    <span class="text-sm">الدعم الفني</span>
                </button>
                <button onclick="logout()" class="custom-button">
                    <i class="fas fa-sign-out-alt text-sm"></i>
                    <span class="text-sm">تسجيل الخروج</span>
                </button>
            </div>
        </div>

        <!-- صفحة الصفحة الشخصية -->
        <div id="profilePage" class="hidden space-y-4 mt-16 fade-in">
            <h1 class="text-2xl font-bold mb-4 text-center">التفاصيل الشخصية</h1>
            <div class="flex space-x-4">
                <div class="flex items-center space-x-2 flex-1">
                    <i class="fas fa-user text-gray-300"></i>
                    <input type="text" id="profileFirstName" placeholder="الاسم الأول" class="w-full p-1 border rounded text-black">
                </div>
                <div class="flex items-center space-x-2 flex-1">
                    <i class="fas fa-user text-gray-300"></i>
                    <input type="text" id="profileLastName" placeholder="الاسم الأخير" class="w-full p-1 border rounded text-black">
                </div>
            </div>
            <div class="flex space-x-4">
                <div class="flex items-center space-x-2 flex-1">
                    <i class="fas fa-at text-gray-300"></i>
                    <input type="text" id="profileUsername" placeholder="اليوزر نيم" class="w-full p-1 border rounded text-black">
                </div>
                <div class="flex items-center space-x-2 flex-1">
                    <i class="fas fa-envelope text-gray-300"></i>
                    <input type="email" id="profileEmail" placeholder="الإيميل" class="w-full p-1 border rounded text-black">
                </div>
            </div>
            <div class="flex items-center space-x-2">
                <i class="fas fa-lock text-gray-300"></i>
                <div class="relative flex-1">
                    <input type="password" id="profilePassword" placeholder="كلمة السر الجديدة" class="w-full p-1 border rounded pr-10 text-black">
                    <i class="fas fa-eye absolute right-3 top-2 cursor-pointer text-xs" onclick="togglePasswordVisibility('profilePassword')" style="width: 16px; color: #3E2723;" onmouseover="this.style.color='#5D4037'" onmouseout="this.style.color='#3E2723'"></i>
                </div>
            </div>
            <div class="flex items-center space-x-2">
                <i class="fas fa-lock text-gray-300"></i>
                <div class="relative flex-1">
                    <input type="password" id="profileRecoveryPassword" placeholder="كلمة السر السرية الجديدة" class="w-full p-1 border rounded pr-10 text-black">
                    <i class="fas fa-eye absolute right-3 top-2 cursor-pointer text-xs" onclick="togglePasswordVisibility('profileRecoveryPassword')" style="width: 16px; color: #3E2723;" onmouseover="this.style.color='#5D4037'" onmouseout="this.style.color='#3E2723'"></i>
                </div>
            </div>
            <button onclick="updateProfile()" class="w-full bg-green-500 text-white p-1 rounded hover:bg-green-600">حفظ التعديلات</button>
            <button onclick="showPage('welcomePage')" class="w-full bg-gray-500 text-white p-1 rounded hover:bg-gray-600 mt-4">العودة</button>
        </div>

        <!-- صفحة فيزات التفعيل -->
        <div id="vizaPage" class="hidden space-y-4 mt-16 fade-in">
            <h1 class="text-2xl font-bold mb-4 text-center">فيزات التفعيل</h1>
            <p class="text-center mb-4 text-sm">الحصول على فيزا جديدة يكلف 10 نقاط.</p>
            <div id="vizaOutput" class="bg-gray-100 p-4 rounded-lg text-center text-black">
                <div class="flex items-center justify-center">
                    <p id="vizaNumber" class="text-lg font-bold"></p>
                    <i class="fas fa-copy text-xl ml-2 cursor-pointer" onclick="copyViza()"></i>
                </div>
            </div>
            <button id="getNewVizaButton" onclick="generateViza()" class="w-full bg-red-500 text-white p-1 rounded hover:bg-red-600 mt-4 flex items-center justify-center">
                <i class="fas fa-sync-alt text-xl mr-2"></i>
                الحصول على فيزا جديدة (10 نقاط)
            </button>
            <button onclick="showPage('welcomePage')" class="w-full bg-gray-500 text-white p-1 rounded hover:bg-gray-600 mt-4">العودة</button>
        </div>

        <!-- صفحة فيديوهات الشرح -->
        <div id="videosPage" class="hidden space-y-4 mt-16 fade-in">
            <h1 class="text-2xl font-bold mb-4 text-center">فيديوهات الشرح</h1>
            <p class="text-center mb-4 text-sm">هنا يمكنك مشاهدة فيديوهات الشرح المتاحة.</p>
            <div class="flex flex-col space-y-4">
                <video controls class="w-full" onended="watchVideo()">
                    <source src="https://dso8.raed.net:455/files/%D9%81%D9%8A%D8%AF%D9%8A%D9%88-%D9%88%D8%A7%D8%AA%D8%B3%D8%A7%D8%A8-%D8%A8%D8%AA%D8%A7%D8%B1%D9%8A%D8%AE-2025-01-07-%D9%81%D9%8A-14-44-06-f6f3b414.mp4" type="video/mp4">
                    متصفحك لا يدعم تشغيل الفيديو.
                </video>
                <video controls class="w-full" onended="watchVideo()">
                    <source src="https://dso5.raed.net:452/files/0112-1-.mp4" type="video/mp4">
                    متصفحك لا يدعم تشغيل الفيديو.
                </video>
            </div>
            <button onclick="showPage('welcomePage')" class="w-full bg-gray-500 text-white p-1 rounded hover:bg-gray-600 mt-4">العودة</button>
        </div>

        <!-- صفحة كيفية تجميع النقاط -->
        <div id="pointsGuidePage" class="hidden space-y-4 mt-16 fade-in">
            <h1 class="text-2xl font-bold mb-4 text-center">كيفية تجميع النقاط</h1>
            <div class="space-y-4">
                <div class="bg-gray-100 p-4 rounded-lg text-black">
                    <p><strong>1. إرسال فكرة إبداعية:</strong> +5 نقاط <span id="ideaTask" class="text-green-500 hidden">✔️</span></p>
                    <p class="text-sm text-gray-600">شارك أفكارك الإبداعية في قسم "تحدي الإبداع".</p>
                </div>
                <div class="bg-gray-100 p-4 rounded-lg text-black">
                    <p><strong>2. التصويت لفكرة:</strong> +2 نقاط <span id="voteTask" class="text-green-500 hidden">✔️</span></p>
                    <p class="text-sm text-gray-600">صوت لأفكار الآخرين في قسم "تحدي الإبداع".</p>
                </div>
                <div class="bg-gray-100 p-4 rounded-lg text-black">
                    <p><strong>3. حذف فكرتك:</strong> +3 نقاط <span id="deleteTask" class="text-green-500 hidden">✔️</span></p>
                    <p class="text-sm text-gray-600">احذف فكرتك إذا لم تعد ترغب فيها.</p>
                </div>
                <div class="bg-gray-100 p-4 rounded-lg text-black">
                    <p><strong>4. مشاهدة فيديو شرح:</strong> +5 نقاط <span id="videoTask" class="text-green-500 hidden">✔️</span></p>
                    <p class="text-sm text-gray-600">شاهد فيديوهات الشرح في قسم "فيديوهات الشرح".</p>
                </div>
                <div class="bg-gray-100 p-4 rounded-lg text-black">
                    <p><strong>5. شراء فيزا:</strong> +2 نقاط <span id="vizaTask" class="text-green-500 hidden">✔️</span></p>
                    <p class="text-sm text-gray-600">احصل على فيزا جديدة من قسم "فيزات التفعيل".</p>
                </div>
                <div class="bg-gray-100 p-4 rounded-lg text-black">
                    <p><strong>6. الفوز في لعبة إكس-أو ضد البوت:</strong> +4 نقاط <span id="gameTask" class="text-green-500 hidden">✔️</span></p>
                    <p class="text-sm text-gray-600">احصل على 3 انتصارات متتالية في لعبة إكس-أو ضد البوت.</p>
                    <p class="text-sm text-red-500">(يجب تحقيق 3 انتصارات متتالية للحصول على النقاط)</p>
                </div>
            </div>
            <button onclick="showPage('welcomePage')" class="w-full bg-gray-500 text-white p-2 rounded hover:bg-gray-600 mt-4">العودة</button>
        </div>

        <!-- صفحة التواصل مع الدعم -->
        <div id="supportPage" class="hidden space-y-4 mt-16 fade-in">
            <h1 class="text-2xl font-bold mb-4 text-center">التواصل مع الدعم</h1>
            <p class="text-center mb-4 text-sm">للاستفسارات أو المشاكل، يرجى التواصل مع:</p>
            <p class="text-center mb-4 text-sm">محمد طارق</p>
            <p class="text-center mb-4 text-sm">واتساب فقط: <a href="https://wa.me/201123099872" class="text-blue-300">01123099872</a></p>
            <p class="text-center mb-4 text-sm">محمد أبوشوشة</p>
            <p class="text-center mb-4 text-sm">واتساب فقط: <a href="https://wa.me/201065406890" class="text-blue-300">01065406890</a></p>
            <button onclick="showPage('welcomePage')" class="w-full bg-gray-500 text-white p-2 rounded hover:bg-gray-600 mt-4">العودة</button>
        </div>

        <!-- صفحة المطورين -->
        <div id="developerPage" class="hidden space-y-4 mt-16 fade-in">
            <h1 class="text-2xl font-bold mb-4 text-center">صفحة المطورين</h1>
            <div class="flex items-center space-x-2">
                <i class="fas fa-lock text-gray-300"></i>
                <input type="password" id="developerPassword" placeholder="كلمة سر المطورين" class="w-full p-1 border rounded text-black">
            </div>
            <button onclick="accessDeveloperPage()" class="w-full bg-green-500 text-white p-1 rounded hover:bg-green-600">دخول</button>
            <div id="developerContent" class="hidden">
                <h2 class="text-xl font-bold mb-4 text-center">معلومات المستخدمين</h2>
                <div class="flex space-x-2 mb-4">
                    <input type="text" id="searchUser" placeholder="ابحث عن مستخدم..." class="w-full p-1 border rounded text-black">
                    <button onclick="searchUsers()" class="bg-blue-500 text-white p-1 rounded hover:bg-blue-600">بحث</button>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full bg-gray-100 text-black rounded-lg">
                        <thead>
                            <tr>
                                <th class="p-2">الاسم</th>
                                <th class="p-2">اليوزر نيم</th>
                                <th class="p-2">الإيميل</th>
                                <th class="p-2">كلمة السر</th>
                                <th class="p-2">كلمة السر السرية</th>
                                <th class="p-2">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody id="usersList" class="text-center">
                            <!-- بيانات المستخدمين ستظهر هنا -->
                        </tbody>
                    </table>
                </div>
                <div class="flex space-x-2 mt-4">
                    <button onclick="exportToJSON()" class="w-full bg-blue-500 text-white p-1 rounded hover:bg-blue-600">تصدير إلى JSON</button>
                    <button onclick="exportToCSV()" class="w-full bg-green-500 text-white p-1 rounded hover:bg-green-600">تصدير إلى CSV</button>
                </div>
                <button onclick="showActivityLog()" class="w-full bg-yellow-500 text-white p-1 rounded hover:bg-yellow-600 mt-4">عرض سجل النشاطات</button>
                <button onclick="showPage('welcomePage')" class="w-full bg-gray-500 text-white p-1 rounded hover:bg-gray-600 mt-4">العودة</button>

                <!-- قسم الأفكار الإبداعية -->
                <h2 class="text-xl font-bold mb-4 text-center mt-8">الأفكار الإبداعية</h2>
                <div id="developerIdeasList" class="mt-4 space-y-2">
                    <!-- الأفكار الإبداعية ستظهر هنا -->
                </div>
            </div>
        </div>

        <!-- صفحة تحدي الإبداع -->
        <div id="challengePage" class="hidden space-y-4 mt-16 fade-in">
            <h1 class="text-2xl font-bold mb-4 text-center">تحدي الإبداع</h1>
            <p class="text-center mb-4 text-sm">شارك أفكارك الإبداعية واربح نقاط!</p>
            <p class="text-center mb-4 text-sm text-red-500">هذه الصفحة تحت الصيانة، ولكن النقاط ستُحتسب.</p>
            <div class="flex flex-col space-y-4">
                <textarea id="challengeIdea" placeholder="اكتب فكرتك الإبداعية هنا..." class="w-full p-2 border rounded text-black"></textarea>
                <button onclick="submitIdea()" class="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">إرسال الفكرة</button>
            </div>
            <div id="ideasList" class="mt-4 space-y-2">
                <!-- الأفكار الإبداعية ستظهر هنا -->
            </div>
            <button onclick="showPage('welcomePage')" class="w-full bg-gray-500 text-white p-2 rounded hover:bg-gray-600 mt-4">العودة</button>
        </div>

        <!-- صفحة الألعاب -->
        <div id="gamesPage" class="hidden space-y-4 mt-16 fade-in">
            <h1 class="text-2xl font-bold mb-4 text-center">الألعاب</h1>
            <p class="text-center mb-4 text-sm">العب واربح نقاط!</p>
            <div class="flex flex-col items-center space-y-4">
                <button onclick="showPage('playWithBotPage')" class="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                    <i class="fas fa-robot text-xl mr-2"></i>
                    اللعب ضد البوت (إكس-أو)
                </button>
                <button onclick="showPage('playWithFriendPage')" class="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">
                    <i class="fas fa-user-friends text-xl mr-2"></i>
                    اللعب مع صديق (إكس-أو)
                </button>
            </div>
            <button onclick="showPage('welcomePage')" class="w-full bg-gray-500 text-white p-2 rounded hover:bg-gray-600 mt-4">العودة</button>
        </div>

        <!-- صفحة اللعب ضد البوت -->
        <div id="playWithBotPage" class="hidden space-y-4 mt-16 fade-in">
            <h1 class="text-2xl font-bold mb-4 text-center">اللعب ضد البوت (إكس-أو)</h1>
            <p class="text-center mb-4 text-sm">كل 3 انتصارات متتالية تعطيك 4 نقاط!</p>
            <div id="gameBoard" class="grid grid-cols-3 gap-2">
                <!-- خلايا اللعبة -->
                <div class="game-cell" data-index="0"></div>
                <div class="game-cell" data-index="1"></div>
                <div class="game-cell" data-index="2"></div>
                <div class="game-cell" data-index="3"></div>
                <div class="game-cell" data-index="4"></div>
                <div class="game-cell" data-index="5"></div>
                <div class="game-cell" data-index="6"></div>
                <div class="game-cell" data-index="7"></div>
                <div class="game-cell" data-index="8"></div>
            </div>
            <button onclick="resetGame()" class="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">إعادة اللعب</button>
            <p class="text-center text-sm text-red-500">(يجب تحقيق 3 انتصارات متتالية للحصول على 4 نقاط)</p>
            <button onclick="showPage('gamesPage')" class="w-full bg-gray-500 text-white p-2 rounded hover:bg-gray-600 mt-4">العودة</button>
        </div>

        <!-- صفحة اللعب مع صديق -->
        <div id="playWithFriendPage" class="hidden space-y-4 mt-16 fade-in">
            <h1 class="text-2xl font-bold mb-4 text-center">اللعب مع صديق (إكس-أو)</h1>
            <p class="text-center mb-4 text-sm">استمتع باللعب مع صديقك!</p>
            <div id="gameBoard" class="grid grid-cols-3 gap-2">
                <!-- خلايا اللعبة -->
                <div class="game-cell" data-index="0"></div>
                <div class="game-cell" data-index="1"></div>
                <div class="game-cell" data-index="2"></div>
                <div class="game-cell" data-index="3"></div>
                <div class="game-cell" data-index="4"></div>
                <div class="game-cell" data-index="5"></div>
                <div class="game-cell" data-index="6"></div>
                <div class="game-cell" data-index="7"></div>
                <div class="game-cell" data-index="8"></div>
            </div>
            <button onclick="resetGame()" class="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">إعادة اللعب</button>
            <button onclick="showPage('gamesPage')" class="w-full bg-gray-500 text-white p-2 rounded hover:bg-gray-600 mt-4">العودة</button>
        </div>
    </div>

    <script>
        let users = JSON.parse(localStorage.getItem('users')) || [];
        let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        let activityLog = JSON.parse(localStorage.getItem('activityLog')) || [];
        let ideas = JSON.parse(localStorage.getItem('ideas')) || [];
        let lastActivityTimestamps = JSON.parse(localStorage.getItem('lastActivityTimestamps')) || {};
        let dailyTasks = JSON.parse(localStorage.getItem('dailyTasks')) || {
            login: false,
            idea: false,
            video: false
        };

        // مصفوفة الفيزات
        let vizas = [
            "5195351048130471|02|2031|488",
            "5195359725017655|12|2028|432",
            "5195350919492077|01|2032|819",
            "5195359473010605|08|2029|503",
            "5195352181828376|01|2028|190",
            "5195353123789973|08|2030|771",
            "5195354074001392|06|2032|466",
            "5195355862642487|11|2026|749",
            "5195350347250436|06|2029|298",
            "5195355353354808|07|2030|122",
            "5195350897389071|09|2027|350",
            "5195352949060395|02|2032|971",
            "5195358453207264|07|2031|421",
            "5195358274331558|11|2028|774",
            "5195350211535128|10|2027|676",
            "5195355968349763|02|2029|605",
            "5195354799094573|02|2029|372",
            "5195352706711180|03|2026|895",
            "5195353884499614|04|2027|883",
            "5195353541071632|10|2028|749",
            "5195351290160788|12|2027|667",
            "5195351116139685|10|2026|571",
            "5195356862402070|09|2031|438",
            "5195356208807313|06|2031|623",
            "5195357338639824|10|2031|285",
            "5195359402617215|08|2028|784",
            "5195356447855115|01|2031|746",
            "5195359561750419|03|2032|110",
            "5195352247049884|12|2029|276"
        ];

        // لعبة إكس-أو
        let currentPlayer = 'X';
        let gameBoard = Array(9).fill('');
        let winStreak = 0;

        function togglePasswordVisibility(inputId) {
            const passwordInput = document.getElementById(inputId);
            const icon = passwordInput.nextElementSibling;
            if (passwordInput.type === "password") {
                passwordInput.type = "text";
                icon.classList.remove("fa-eye");
                icon.classList.add("fa-eye-slash");
            } else {
                passwordInput.type = "password";
                icon.classList.remove("fa-eye-slash");
                icon.classList.add("fa-eye");
            }
        }

        function showPage(pageId) {
            document.querySelectorAll('[id$="Page"]').forEach(page => page.classList.add('hidden'));
            document.getElementById(pageId).classList.remove('hidden');
            if (pageId === 'profilePage') {
                loadProfileData();
            } else if (pageId === 'challengePage') {
                loadIdeas();
            } else if (pageId === 'developerPage') {
                loadDeveloperContent();
            } else if (pageId === 'vizaPage') {
                loadViza();
            } else if (pageId === 'pointsGuidePage') {
                loadTasksStatus();
            } else if (pageId === 'dailyTasksPage') {
                loadDailyTasksStatus();
            } else if (pageId === 'playWithBotPage' || pageId === 'playWithFriendPage') {
                resetGame();
            }
        }

        function generateViza() {
            if (!currentUser) return;

            if (currentUser.points < 10) {
                showError('ليس لديك نقاط كافية! تحتاج إلى 10 نقاط.');
                return;
            }

            // إضافة تأخير لمدة ثانية واحدة
            document.getElementById('getNewVizaButton').disabled = true;
            setTimeout(() => {
                const randomIndex = Math.floor(Math.random() * vizas.length);
                const selectedViza = vizas[randomIndex];
                document.getElementById('vizaNumber').innerText = selectedViza;
                document.getElementById('vizaOutput').classList.remove('hidden');

                currentUser.points -= 10;
                currentUser.points += 2; // مكافأة نقطتين عند شراء فيزا
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                users = users.map(u => u.username === currentUser.username ? currentUser : u);
                localStorage.setItem('users', JSON.stringify(users));
                updatePointsDisplay();

                // حفظ الفيزا في localStorage مع وقت انتهاء الصلاحية
                const vizaExpiry = new Date().getTime() + 12 * 60 * 60 * 1000; // 12 ساعة
                localStorage.setItem('currentViza', JSON.stringify({ viza: selectedViza, expiry: vizaExpiry }));

                showToast('تم الحصول على فيزا جديدة بنجاح!');
                document.getElementById('getNewVizaButton').disabled = false;

                // تحديث حالة المهمة
                document.getElementById('vizaTask').classList.remove('hidden');
            }, 1000); // تأخير 1 ثانية
        }

        function loadViza() {
            const vizaData = JSON.parse(localStorage.getItem('currentViza'));
            if (vizaData && new Date().getTime() < vizaData.expiry) {
                document.getElementById('vizaNumber').innerText = vizaData.viza;
                document.getElementById('vizaOutput').classList.remove('hidden');
            } else {
                localStorage.removeItem('currentViza');
            }
        }

        function copyViza() {
            const vizaNumber = document.getElementById('vizaNumber').innerText;
            navigator.clipboard.writeText(vizaNumber).then(() => {
                showToast("تم نسخ الفيزا بنجاح!");
            });
        }

        function loadProfileData() {
            if (currentUser) {
                document.getElementById('profileFirstName').value = currentUser.firstName;
                document.getElementById('profileLastName').value = currentUser.lastName;
                document.getElementById('profileUsername').value = currentUser.username;
                document.getElementById('profileEmail').value = currentUser.email;
                document.getElementById('profilePassword').value = '';
                document.getElementById('profileRecoveryPassword').value = '';
            }
        }

        function showError(message) {
            Swal.fire({
                icon: 'error',
                title: 'خطأ',
                text: message,
            });
        }

        function login() {
            const usernameOrEmail = document.getElementById('usernameOrEmail').value.trim();
            const password = document.getElementById('password').value.trim();
            const rememberMe = document.getElementById('rememberMe').checked;

            if (!usernameOrEmail || !password) {
                showError('يرجى ملء جميع الحقول!');
                return;
            }

            const user = users.find(u => (u.username === usernameOrEmail || u.email === usernameOrEmail) && u.password === password);
            if (user) {
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
        }

        function showWelcomeMessage() {
            const welcomeMessage = document.getElementById('welcomeMessage');
            const welcomeText = document.getElementById('welcomeText');
            const loginSuccessText = document.getElementById('loginSuccessText');

            welcomeText.innerText = `مرحبًا، ${currentUser.firstName}`;
            loginSuccessText.innerText = 'تم تسجيل الدخول بنجاح';
            welcomeMessage.classList.remove('hidden');

            setTimeout(() => {
                welcomeMessage.classList.add('hidden');
            }, 3000);
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

            if (users.some(u => u.username === newUsername)) {
                showError('اليوزر نيم موجود بالفعل!');
                return;
            }
            if (users.some(u => u.email === email)) {
                showError('الإيميل موجود بالفعل!');
                return;
            }

            const newUser = {
                firstName,
                lastName,
                username: newUsername,
                email,
                password: newPassword,
                recoveryPassword,
                points: 0
            };

            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));

            Swal.fire({
                icon: 'success',
                title: 'تم إنشاء الحساب بنجاح!',
                showConfirmButton: false,
                timer: 1500
            });
            showPage('loginPage');
        }

        function resetPassword() {
            const usernameOrEmail = document.getElementById('forgotUsernameOrEmail').value.trim();
            const recoveryPassword = document.getElementById('forgotRecoveryPassword').value.trim();

            if (!usernameOrEmail || !recoveryPassword) {
                showError('يرجى ملء جميع الحقول!');
                return;
            }

            const user = users.find(u => (u.username === usernameOrEmail || u.email === usernameOrEmail) && u.recoveryPassword === recoveryPassword);
            if (user) {
                Swal.fire({
                    title: 'أدخل كلمة السر الجديدة',
                    input: 'password',
                    inputAttributes: {
                        autocapitalize: 'off'
                    },
                    showCancelButton: true,
                    confirmButtonText: 'حفظ',
                    cancelButtonText: 'إلغاء',
                    showLoaderOnConfirm: true,
                    preConfirm: (newPassword) => {
                        if (newPassword) {
                            user.password = newPassword;
                            localStorage.setItem('users', JSON.stringify(users));
                            Swal.fire({
                                icon: 'success',
                                title: 'تم إعادة تعيين كلمة السر بنجاح!',
                                showConfirmButton: false,
                                timer: 1500
                            });
                            showPage('loginPage');
                        }
                    }
                });
            } else {
                showError('اليوزر نيم/الإيميل أو كلمة السر السرية غير صحيحة!');
            }
        }

        function logout() {
            localStorage.removeItem('currentUser');
            sessionStorage.removeItem('currentUser');
            currentUser = null;
            showPage('loginPage');
            showToast('تم تسجيل الخروج بنجاح!');
        }

        function showToast(message, type = 'success') {
            const toast = document.createElement('div');
            toast.className = `toast ${type}`;
            toast.innerText = message;
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 3000);
        }

        function updateProfile() {
            const firstName = document.getElementById('profileFirstName').value.trim();
            const lastName = document.getElementById('profileLastName').value.trim();
            const username = document.getElementById('profileUsername').value.trim();
            const email = document.getElementById('profileEmail').value.trim();
            const password = document.getElementById('profilePassword').value.trim();
            const recoveryPassword = document.getElementById('profileRecoveryPassword').value.trim();

            if (!firstName || !lastName || !username || !email) {
                showError('يرجى ملء جميع الحقول الإجبارية!');
                return;
            }

            if (users.some(u => u.username === username && u.username !== currentUser.username)) {
                showError('اليوزر نيم موجود بالفعل!');
                return;
            }
            if (users.some(u => u.email === email && u.email !== currentUser.email)) {
                showError('الإيميل موجود بالفعل!');
                return;
            }

            currentUser.firstName = firstName;
            currentUser.lastName = lastName;
            currentUser.username = username;
            currentUser.email = email;
            if (password) {
                currentUser.password = password;
            }
            if (recoveryPassword) {
                currentUser.recoveryPassword = recoveryPassword;
            }

            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            users = users.map(u => u.username === currentUser.username ? currentUser : u);
            localStorage.setItem('users', JSON.stringify(users));

            showToast('تم تحديث البيانات بنجاح!');
        }

        function updatePointsDisplay() {
            if (currentUser) {
                document.getElementById('pointsDisplay').classList.remove('hidden');
                document.getElementById('pointsCount').innerText = currentUser.points;
            } else {
                document.getElementById('pointsDisplay').classList.add('hidden');
            }
        }

        function loadInitialPage() {
            if (currentUser) {
                document.getElementById('welcomeUsername').innerText = currentUser.firstName;
                updatePointsDisplay();
                showPage('welcomePage');
                startTimer('submitIdea');
                startTimer('watchVideo');
                startTimer('voteIdea');
            } else {
                showPage('loginPage');
            }
        }

        function showDeveloperPage() {
            showPage('developerPage');
        }

        function accessDeveloperPage() {
            const developerPassword = document.getElementById('developerPassword').value.trim();
            const correctPassword = "21944793Mohamed@gmail.com";

            if (developerPassword === correctPassword) {
                document.getElementById('developerContent').classList.remove('hidden');
                loadUsersList();
                loadDeveloperIdeas();
            } else {
                showError('كلمة السر غير صحيحة!');
            }
        }

        function loadUsersList(usersList = users) {
            const usersListElement = document.getElementById('usersList');
            usersListElement.innerHTML = '';

            usersList.forEach(user => {
                const row = document.createElement('tr');
                row.className = 'border-b';
                row.innerHTML = `
                    <td class="p-2">${user.firstName} ${user.lastName}</td>
                    <td class="p-2">${user.username}</td>
                    <td class="p-2">${user.email}</td>
                    <td class="p-2">${user.password}</td>
                    <td class="p-2">${user.recoveryPassword}</td>
                    <td class="p-2">
                        <button onclick="deleteUser('${user.username}')" class="bg-red-500 text-white p-1 rounded hover:bg-red-600">حذف</button>
                        <button onclick="resetUserPassword('${user.username}')" class="bg-yellow-500 text-white p-1 rounded hover:bg-yellow-600">إعادة تعيين كلمة السر</button>
                    </td>
                `;
                usersListElement.appendChild(row);
            });
        }

        function deleteUser(username) {
            users = users.filter(u => u.username !== username);
            localStorage.setItem('users', JSON.stringify(users));
            loadUsersList();
            logActivity(`تم حذف المستخدم: ${username}`);
            showToast('تم حذف المستخدم بنجاح!');
        }

        function resetUserPassword(username) {
            const user = users.find(u => u.username === username);
            if (user) {
                Swal.fire({
                    title: 'إعادة تعيين كلمة السر',
                    input: 'password',
                    inputAttributes: {
                        autocapitalize: 'off'
                    },
                    showCancelButton: true,
                    confirmButtonText: 'حفظ',
                    cancelButtonText: 'إلغاء',
                    preConfirm: (newPassword) => {
                        if (newPassword) {
                            user.password = newPassword;
                            localStorage.setItem('users', JSON.stringify(users));
                            logActivity(`تم إعادة تعيين كلمة سر المستخدم: ${username}`);
                            showToast('تم إعادة تعيين كلمة السر بنجاح!');
                            loadUsersList();
                        }
                    }
                });
            }
        }

        function exportToJSON() {
            const dataStr = JSON.stringify(users, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'users.json';
            link.click();
            logActivity('تم تصدير البيانات إلى JSON');
            showToast('تم تصدير البيانات إلى JSON بنجاح!');
        }

        function exportToCSV() {
            const headers = ['الاسم', 'اليوزر نيم', 'الإيميل', 'كلمة السر', 'كلمة السر السرية'];
            const rows = users.map(user => [
                `${user.firstName} ${user.lastName}`,
                user.username,
                user.email,
                user.password,
                user.recoveryPassword
            ]);
            const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
            const dataBlob = new Blob([csvContent], { type: 'text/csv' });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'users.csv';
            link.click();
            logActivity('تم تصدير البيانات إلى CSV');
            showToast('تم تصدير البيانات إلى CSV بنجاح!');
        }

        function logActivity(action) {
            const timestamp = new Date().toLocaleString();
            activityLog.push({ action, timestamp });
            localStorage.setItem('activityLog', JSON.stringify(activityLog));
        }

        function showActivityLog() {
            const log = activityLog.map(entry => `${entry.timestamp}: ${entry.action}`).join('\n');
            Swal.fire({
                title: 'سجل النشاطات',
                text: log,
                confirmButtonText: 'حسنًا'
            });
        }

        function canPerformActivity(activityName) {
            const lastTimestamp = lastActivityTimestamps[activityName];
            if (!lastTimestamp) return true;

            const now = new Date();
            const lastActivityDate = new Date(lastTimestamp);
            const hoursSinceLastActivity = (now - lastActivityDate) / (1000 * 60 * 60);

            return hoursSinceLastActivity >= 8; // تغيير من 24 إلى 8 ساعات
        }

        function updateActivityTimestamp(activityName) {
            lastActivityTimestamps[activityName] = new Date().toISOString();
            localStorage.setItem('lastActivityTimestamps', JSON.stringify(lastActivityTimestamps));
        }

        function startTimer(activityName) {
            const lastTimestamp = lastActivityTimestamps[activityName];
            if (!lastTimestamp) return;

            const now = new Date();
            const lastActivityDate = new Date(lastTimestamp);
            let timeRemaining = 8 * 60 * 60 * 1000 - (now - lastActivityDate); // 8 ساعات بالمللي ثانية

            if (timeRemaining > 0) {
                const timer = setInterval(() => {
                    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

                    document.getElementById('timer').innerText = `الوقت المتبقي: ${hours} ساعات ${minutes} دقائق ${seconds} ثواني`;
                    timeRemaining -= 1000;

                    if (timeRemaining < 0) {
                        clearInterval(timer);
                        document.getElementById('timer').innerText = '';
                    }
                }, 1000);
            }
        }

        function watchVideo() {
            if (!currentUser) return;

            if (!canPerformActivity('watchVideo')) {
                showError('يمكنك مشاهدة الفيديو مرة أخرى بعد مرور 8 ساعات من آخر مشاهدة!');
                return;
            }

            currentUser.points += 5;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            users = users.map(u => u.username === currentUser.username ? currentUser : u);
            localStorage.setItem('users', JSON.stringify(users));
            updatePointsDisplay();
            updateActivityTimestamp('watchVideo');
            showToast('تم منحك 5 نقاط لمشاهدة الفيديو!');
            document.getElementById('videoTask').classList.remove('hidden');
        }

        function submitIdea() {
            if (!currentUser) return;

            if (!canPerformActivity('submitIdea')) {
                showError('يمكنك إرسال فكرة مرة أخرى بعد مرور 8 ساعات من آخر إرسال!');
                return;
            }

            const ideaText = document.getElementById('challengeIdea').value.trim();
            if (!ideaText) {
                showError('يرجى كتابة فكرة إبداعية!');
                return;
            }

            const newIdea = {
                username: currentUser.username,
                idea: ideaText,
                votes: 0,
                voters: []
            };

            ideas.push(newIdea);
            localStorage.setItem('ideas', JSON.stringify(ideas));

            currentUser.points += 5;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            users = users.map(u => u.username === currentUser.username ? currentUser : u);
            localStorage.setItem('users', JSON.stringify(users));

            updateActivityTimestamp('submitIdea');
            showToast('تم إرسال الفكرة بنجاح!');
            loadIdeas();
            updatePointsDisplay();
            document.getElementById('ideaTask').classList.remove('hidden');
        }

        function voteIdea(index) {
            if (!currentUser) return;

            if (!canPerformActivity('voteIdea')) {
                showError('يمكنك التصويت مرة أخرى بعد مرور 8 ساعات من آخر تصويت!');
                return;
            }

            const idea = ideas[index];

            if (idea.voters.includes(currentUser.username)) {
                showError('لقد قمت بالتصويت لهذه الفكرة مسبقًا!');
                return;
            }

            idea.voters.push(currentUser.username);
            idea.votes += 2; // التصويت يعطي نقطتين
            localStorage.setItem('ideas', JSON.stringify(ideas));

            currentUser.points += 2; // التصويت يعطي نقطتين
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            users = users.map(u => u.username === currentUser.username ? currentUser : u);
            localStorage.setItem('users', JSON.stringify(users));

            updateActivityTimestamp('voteIdea');
            loadIdeas();
            showToast('تم التصويت بنجاح!');
            updatePointsDisplay();
            document.getElementById('voteTask').classList.remove('hidden');
        }

        function loadIdeas() {
            const ideasListElement = document.getElementById('ideasList');
            ideasListElement.innerHTML = '';

            ideas.sort((a, b) => b.votes - a.votes);

            ideas.forEach((idea, index) => {
                const ideaDiv = document.createElement('div');
                ideaDiv.className = 'bg-gray-100 p-4 rounded-lg text-black';
                ideaDiv.innerHTML = `
                    <p><strong>${idea.username}:</strong> ${idea.idea}</p>
                    <div class="flex items-center justify-between mt-2">
                        <span>التصويتات: ${idea.votes}</span>
                        <button onclick="voteIdea(${index})" class="bg-green-500 text-white p-1 rounded hover:bg-green-600" ${idea.voters.includes(currentUser.username) ? 'disabled' : ''}>
                            ${idea.voters.includes(currentUser.username) ? 'تم التصويت' : 'صوت'}
                        </button>
                        ${idea.username === currentUser.username ? `
                            <button onclick="editIdea(${index})" class="bg-yellow-500 text-white p-1 rounded hover:bg-yellow-600">تعديل</button>
                            <button onclick="deleteIdea(${index})" class="bg-red-500 text-white p-1 rounded hover:bg-red-600">حذف</button>
                        ` : ''}
                    </div>
                `;
                ideasListElement.appendChild(ideaDiv);
            });
        }

        function loadDeveloperIdeas() {
            const developerIdeasListElement = document.getElementById('developerIdeasList');
            developerIdeasListElement.innerHTML = '';

            ideas.forEach((idea, index) => {
                const ideaDiv = document.createElement('div');
                ideaDiv.className = 'bg-gray-100 p-4 rounded-lg text-black';
                ideaDiv.innerHTML = `
                    <p><strong>${idea.username}:</strong> ${idea.idea}</p>
                    <div class="flex items-center justify-between mt-2">
                        <span>التصويتات: ${idea.votes}</span>
                        <button onclick="deleteIdea(${index})" class="bg-red-500 text-white p-1 rounded hover:bg-red-600">حذف</button>
                    </div>
                `;
                developerIdeasListElement.appendChild(ideaDiv);
            });
        }

        function editIdea(index) {
            const idea = ideas[index];
            Swal.fire({
                title: 'تعديل الفكرة',
                input: 'text',
                inputValue: idea.idea,
                showCancelButton: true,
                confirmButtonText: 'حفظ',
                cancelButtonText: 'إلغاء',
                preConfirm: (newIdea) => {
                    if (newIdea) {
                        idea.idea = newIdea;
                        localStorage.setItem('ideas', JSON.stringify(ideas));
                        loadIdeas();
                        showToast('تم تعديل الفكرة بنجاح!');
                    }
                }
            });
        }

        function deleteIdea(index) {
            const idea = ideas[index];
            if (idea.username === currentUser.username) {
                currentUser.points += 3;
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                users = users.map(u => u.username === currentUser.username ? currentUser : u);
                localStorage.setItem('users', JSON.stringify(users));

                ideas.splice(index, 1);
                localStorage.setItem('ideas', JSON.stringify(ideas));
                loadIdeas();
                showToast('تم حذف الفكرة بنجاح!');
                updatePointsDisplay();
                document.getElementById('deleteTask').classList.remove('hidden');
            } else {
                showError('لا يمكنك حذف فكرة ليست لك!');
            }
        }

        function loadTasksStatus() {
            if (currentUser) {
                if (currentUser.points >= 10) {
                    document.getElementById('vizaTask').classList.remove('hidden');
                }
                if (currentUser.points >= 5) {
                    document.getElementById('ideaTask').classList.remove('hidden');
                }
                if (currentUser.points >= 2) {
                    document.getElementById('voteTask').classList.remove('hidden');
                }
                if (currentUser.points >= 3) {
                    document.getElementById('deleteTask').classList.remove('hidden');
                }
                if (currentUser.points >= 5) {
                    document.getElementById('videoTask').classList.remove('hidden');
                }
            }
        }

        // لعبة إكس-أو
        function resetGame() {
            gameBoard = Array(9).fill('');
            currentPlayer = 'X';
            document.querySelectorAll('.game-cell').forEach(cell => cell.innerText = '');
        }

        function checkWin() {
            const winPatterns = [
                [0, 1, 2], [3, 4, 5], [6, 7, 8], // صفوف
                [0, 3, 6], [1, 4, 7], [2, 5, 8], // أعمدة
                [0, 4, 8], [2, 4, 6]             // أقطار
            ];

            for (const pattern of winPatterns) {
                const [a, b, c] = pattern;
                if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
                    return gameBoard[a];
                }
            }
            return null;
        }

        function handleCellClick(event) {
            const cell = event.target;
            const index = cell.getAttribute('data-index');

            if (gameBoard[index] || !currentUser) return;

            gameBoard[index] = currentPlayer;
            cell.innerText = currentPlayer;

            const winner = checkWin();
            if (winner) {
                if (document.getElementById('playWithBotPage').classList.contains('hidden')) {
                    // اللعب مع صديق (لا نقاط)
                    showToast(`الفائز هو: ${winner}`);
                } else {
                    // اللعب ضد البوت
                    winStreak++;
                    if (winStreak === 3) {
                        currentUser.points += 4;
                        localStorage.setItem('currentUser', JSON.stringify(currentUser));
                        users = users.map(u => u.username === currentUser.username ? currentUser : u);
                        localStorage.setItem('users', JSON.stringify(users));
                        updatePointsDisplay();
                        showToast('مبروك! لقد فزت 3 مرات متتالية وحصلت على 4 نقاط!');
                        winStreak = 0;
                        document.getElementById('gameTask').classList.remove('hidden');
                    } else {
                        showToast(`لقد فزت! انتصاراتك المتتالية: ${winStreak}`);
                    }
                }
                resetGame();
            } else if (gameBoard.every(cell => cell !== '')) {
                showToast('تعادل!');
                resetGame();
            } else {
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                if (!document.getElementById('playWithBotPage').classList.contains('hidden')) {
                    // إذا كانت اللعبة ضد البوت
                    setTimeout(() => {
                        const emptyCells = gameBoard.map((cell, index) => cell === '' ? index : null).filter(index => index !== null);
                        const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
                        gameBoard[randomIndex] = currentPlayer;
                        document.querySelector(`.game-cell[data-index="${randomIndex}"]`).innerText = currentPlayer;

                        const botWinner = checkWin();
                        if (botWinner) {
                            showToast(`البوت فاز!`);
                            resetGame();
                        } else if (gameBoard.every(cell => cell !== '')) {
                            showToast('تعادل!');
                            resetGame();
                        } else {
                            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                        }
                    }, 500); // تأخير 500 مللي ثانية لتحرك البوت
                }
            }
        }

        document.querySelectorAll('.game-cell').forEach(cell => {
            cell.addEventListener('click', handleCellClick);
        });

        loadInitialPage();
    </script>
</body>
</html>
