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
            'REQUEST_TODO':'Todo List',

            /*upload list*/
            'UPLOAD_TITLE':'items pending to upload',
            'START_UPLOAD1':'Start',
            'START_UPLOAD2':'Upload',

            /*newAct*/
            'NEW_ACT_TITLE':'New Activity / Photo',
			'SELECT_LOCATION':'Select Location',
			'SELECT_CATEGORY':'Select Category',
			'REQUEST_REVIEW':'Request Review / Notify',
			'SELECT_REVIEWER':'Select Reviewer',
			'TRADE_SUBCONTRACTOR':'Trade / Subcontractor',
			'TRADE':'Trade',
			'SELECT_TRADE':'Select Trade',
			'SUBCONTRACTOR':'Subcontractor',
			'SELECT_SUBCONTRACTOR':'Select Subcontractor',
			'PHOTO':'Photo',
			'INPUT_LOG_HERE':'Input Diary entry here…',
			'DELETE':'Delete',

			/*system*/
			'CURRENT_USER':'Current User',
			'LANGUAGE':'Language',
			'JOB_NUMBER':'Job Number',
			'LANGUAGE_CONTENT':'English',
			'ALLOW_3G':'Allow 3G Upload',
			'NOTIFICATION':'Notification',
			'SIGN_OUT':'SIGN OUT',
			'SUPPORT_HOTLINE':'Support Hotline',

			/*category*/
			'CATEGORY':'Category',

			/*location*/
			'LOCATION':'Location',
			/*select user*/
			'SELECT_USER':'Select User',
			/*photo*/
			'SELECTED':'Selected',
			/*job list*/
			'JOB_LIST':'Job List',
            'UPLOADING':'Uploading...',
            'STOPPING':'Stopping...',
            'STOP_UPLOAD1':'Stop',
            'STOP_UPLOAD2':'Uploading',
            'STOPPING1':'Doing',
            'STOPPING2':'Stopping',

			/* 弹出框 */
			'OK': 'OK',
			'CANCEL': 'Cancel',
			'EXIT': 'Exit',
			'TIPS': "Tips",
			'EXIT_MSG': 'Do you want to exit the App?',
			'LOADING': 'Loading...',
            'CONFIRM_TOGGLE_PROJECT':'Confirm Toggle Project',
            'CONFIRM_TOGGLE_PROJECT_CONTENT':'Are you sure to toggle project? It will clear what you fill in new Acticity',

			/* 错误提示 */
			'INVALID_LOGIN': 'Incorrect Username or Password!',
			'INVALID_EMP_ID': 'Incorrect Employee Details!',
			'NET_WORK_ERROR': 'Network Error!',
			'PLEASE_SELECT_JOB': 'Please select your job!',
			'SAVE_TO_PENDING_SUCCESS': 'Save to pending list success!',
			'MANDATORY_NOT_FILL': 'Please select location and category, fill in log or attach images!',
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
            'REQUEST_TODO':'待辦事項',
			/*upload list*/
            'UPLOAD_TITLE':'項待上傳',
            'START_UPLOAD1':'開始',
            'START_UPLOAD2':'上傳',

			/*newAct*/
            'NEW_ACT_TITLE':'新活動 / 照片',
			'SELECT_LOCATION':'選擇地址',
			'SELECT_CATEGORY':'選擇類別',
			'REQUEST_REVIEW':'請求檢查 / 通知',
			'SELECT_REVIEWER':'選擇檢查員',
			'TRADE_SUBCONTRACTOR':'交易 / 外判商',
            'TRADE':'交易',
			'SELECT_TRADE':'選擇交易',
			'SUBCONTRACTOR':'外判商',
			'SELECT_SUBCONTRACTOR':'選擇外判商',
			'PHOTO':'照片',
			'INPUT_LOG_HERE':'请输入项目日志…',
			'DELETE':'删除',

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
            'UPLOADING':'正在上傳...',
            'STOPPING':'正在停止...',
            'STOP_UPLOAD1':'停止',
            'STOP_UPLOAD2':'上傳',
            'STOPPING1':'正在',
            'STOPPING2':'停止',

            /* 弹出框 */
		    'OK': '確定',
		    'CANCEL': '取消',
		    'EXIT': '退出',
		    'TIPS': "提示",
		    'EXIT_MSG': '你确定要退出应用吗?',
		    'LOADING': '載入中...',
            'CONFIRM_TOGGLE_PROJECT':'確認切換項目',
            'CONFIRM_TOGGLE_PROJECT_CONTENT':'確定要切換項目，如果切換，將會清空已填內容',

            /* 错误提示 */
		    'INVALID_LOGIN': '不正確的用戶名稱或密碼!',
		    'INVALID_EMP_ID': '不正確的顧員資料!',
			'NET_WORK_ERROR': '网络连接错误!',
			'PLEASE_SELECT_JOB': '请选择你的工作项目!',
			'SAVE_TO_PENDING_SUCCESS': '保存到待上传列表成功!',
			'MANDATORY_NOT_FILL': '请选择地址和类别, 输入项目日志或者拍照!',
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
