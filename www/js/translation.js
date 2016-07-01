'use strict';
(function(){
	angular.module('translation',['ngCookies','pascalprecht.translate', 'userPref'])
		.config(TranslationConfig)
		.controller('TranslationsMainCtrl',TranslationsMainCtrl);

	function TranslationConfig ($translateProvider){

		$translateProvider.preferredLanguage('us_en');
		$translateProvider.useLocalStorage();
		$translateProvider.useSanitizeValueStrategy('escapeParameters');

		$translateProvider.translations('us_en',{
			
			/*login*/
			'APP_TITLE': 'Gammon Employee App',
			'ACTIVE_DIRECTORY': 'Active Directory',
			'EMPLOYEE_ID': 'Employee ID',
            'USERNAME': 'Username',
            'PASSWORD': 'Password',
            'MOBILE_NUMBER': 'Mobile #',
            'HKID': 'HKID',
			'SIGNIN': 'Sign In',
            'SIGNOUT': 'Sign Out',
            'CLEAR': 'Clear',

            /*task list*/
            'REQUEST_TODO':'Request To Do',

            /*upload list*/
            'UPLOAD_TITLE':'items pending to upload',
            'START_UPLOAD':'Start upload',

            /*newAct*/
            'NEW_ACT_TITLE':'New Activity / Photo',
			'LOCATION':'Block A / Ground Floor',
			'PROGRESS_RECORD':'Progress record',
			'REQUEST_REVIEW':'Request review / Notify',
			'REVIEW_BY':'Review by',
			'TRADE_SUBCONTRACTOR':'Trade / Subcontractor',
			'TRADE':'Trade',
			'SUBCONTRACTOR':'Subcontractor',
			'PHOTO':'photo',
			//'mockInputData':'Input Diary entry here…',

			/*system*/
			'CURRENT_USER':'Current User',
			'LANGUAGE':'Language',
			'JOB_NUMBER':'Job number',
			'LANGUAGE_CONTENT':'English',
			'ALLOW_3G':'Allow 3G Upload',
			'NOTIFICATION':'Notification',
			'SIGN_OUT':'SIGN OUT',
			'SUPPORT_HOTLINE':'Support hotline',

			/*category*/
			'CATEGORY':'category',

			/*location*/
			'LOCATION':'location',
			/*select user*/
			'SELECT_USER':'select_user',
			/*photo*/
			'SELECTED':'selected',
			/*job list*/
			'JOB_LIST':'Job List',

            /*'TRANSLATE': 'EN',
            'LOADING': 'Loading...',
            
            
            'INVALID_LOGIN': 'Incorrect Username or Password',
            'INVALID_EMP_ID': 'Incorrect Employee Details',
            'OTP': 'One-Time-Password',
            'OTP_MESSAGE': 'System has sent you a One-Time-Password using SMS at [time].',
            'REQUEST_OTP': 'Request OTP',
            'PASSCODE': 'Passcode',
            'PASSCODE_SETUP': 'Setup Your Passcode',
            'PASSCODE_ENTER': 'Enter Your Passcode',
            'PASSCODE_CONFIRM': 'Re-Enter Passcode to Confirm',
            'PASSCODE_INCORRECT': 'Passcode is incorrect, please try again.',
            'PASSCODE_MISMATCH': 'Passcode does not match, please try again.',
            'OK': 'OK',
            
            'COMMUNICATIONS': 'News',
            'PEOPLE': 'People',
            'ELEAVE': 'eLeave',
            'MORE': 'More',
            'LATEST': 'Latest',
            'CEOBLOG': 'CEO Blog',
            'VERSION': 'Version'*/

		});
		$translateProvider.translations('zh_hk', {
			/*login*/
            'APP_TITLE': '金門顧員應用程式',
			'ACTIVE_DIRECTORY': '網絡賬戶',
            'EMPLOYEE_ID': '顧員編號',
            'USERNAME': '用戶名稱',
            'PASSWORD': '密碼',
            'MOBILE_NUMBER': '手提電話號碼',
            'HKID': '香港身分證號碼',
			'SIGNIN': '登入',
            'SIGNOUT': '登出',
            'CLEAR': '清除',

			/*request list*/
            'REQUEST_TODO':'請求事項',
			/*upload list*/
            'UPLOAD_TITLE':'項待上傳',
            'START_UPLOAD':'開始上傳',

			/*newAct*/
            'NEW_ACT_TITLE':'新活動 / 照片',
			'LOCATION':'A棟 / 地下',
			'PROGRESS_RECORD':'進展記錄',
			'REQUEST_REVIEW':'請求檢查 / 通知',
			'REVIEW_BY':'檢查員',
			'TRADE_SUBCONTRACTOR':'交易 / 外判商',
			'TRADE':'交易',
			'SUBCONTRACTOR':'外判商',
			'PHOTO':'照片',
			//'mockInputData':'请输入项目日志…',

			/*system*/
			'CURRENT_USER':'當前用戶',
			'LANGUAGE':'語言',
			'JOB_NUMBER':'工作號碼',
			'LANGUAGE_CONTENT':'繁體中文',
			'ALLOW_3G':'允許3G上傳',
			'NOTIFICATION':'通知',
			'SIGN_OUT':'登出',
			'SUPPORT_HOTLINE':'支持熱線',

			/*category*/
			'CATEGORY':'類別',
			/*location*/
			'LOCATION':'地址',
			/*select user*/
			'SELECT_USER':'选择用户',
			/*photo*/
			'SELECTED':'項被選中',
			/*job list*/
			'JOB_LIST':'工作號碼列表',

            /*'TRANSLATE': '中',
            'LOADING': '載入中...',
            
            
            'INVALID_LOGIN': '不正確的用戶名稱或密碼',
            'INVALID_EMP_ID': '不正確的顧員資料',
            'OTP': '單次使用驗證碼',
            'OTP_MESSAGE': '系統於 [time] 向你的登記手提電話號碼發出了單次使用驗證碼。',
            'REQUEST_OTP': 'Request OTP',
            'PASSCODE': '簡易登入編碼',
            'PASSCODE_SETUP': '設定簡易登入編碼',
            'PASSCODE_ENTER': '輸入簡易登入編碼',
            'PASSCODE_CONFIRM': '再次輸入簡易登入編碼',
            'PASSCODE_INCORRECT': '簡易登入編碼不正確，請再次輸入。',
            'PASSCODE_MISMATCH': '簡易登入編碼不匹配，請再次輸入。',
            'OK': '確定',
            
            'COMMUNICATIONS': '通訊',
            'PEOPLE': '人員',
            'ELEAVE': '假期',
            'MORE': '更多',
            'LATEST': '近況',
            'CEOBLOG': '總裁博客',
            'VERSION': '版本編號'*/
        });

	}
	function TranslationsMainCtrl($rootScope,$scope, $translate, userPref){
		var _changeLanguage = function () {
			console.log('change');
			var lang = userPref.getLanguage() || 'us_en';
			console.log('old language:'+lang);
			if(lang === "us_en"){
				lang = 'zh_hk';
			} else if(lang === 'zh_hk'){
				lang = 'us_en';
			}
			$translate.use(lang);
			userPref.setLanguage(lang);
			console.log('[Language] New Language : '+ lang);
			$rootScope.$broadcast('changeLanguage', lang);
		}
		$scope.changeLanguage = _changeLanguage;
		
	}
})()