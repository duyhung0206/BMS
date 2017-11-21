<!DOCTYPE html>
<html ng-app="myApp">
<head>
	<title>BMS</title>
	<link rel="stylesheet" type="text/css" href="{{asset('css/lumen/bootstrap.min.css')}}">
{{--	<link rel="stylesheet" type="text/css" href="{{asset('css/united/bootstrap.min.css')}}">--}}
	<link rel="stylesheet" href="{{asset('bower_components/font-awesome/css/font-awesome.min.css')}}">
	<link rel="stylesheet" type="text/css" href="{{asset('css/app.css')}}">
	<link rel="stylesheet" type="text/css" href="{{asset('bower_components/angular-loading-bar/build/loading-bar.css')}}">
	<link rel="stylesheet" type="text/css" href="{{asset('bower_components/bootstrap-datepicker/dist/css/bootstrap-datepicker3.css')}}">
	<link rel="stylesheet" type="text/css" href="{{asset('bower_components/angular-ui-select/dist/select.css')}}">
	<script type="text/javascript">
        var baseUrl = "{{url('/')}}/admin/";
        var csrfToken = "{{csrf_token()}}";
	</script>
</head>
<body ng-controller="globalController">
	<div class="container">
		<div ng-include="'templates/adminhtml/partials/confirmDelete.html'" ng-controller="confirmDeleteController"></div>
		<div id="divNotification" ng-include="'templates/adminhtml/partials/notify.html'" ng-controller="notifyController" class="container"></div>
		<div ng-view></div>
	</div>

	<script type="text/javascript" src="{{asset('bower_components/jquery/dist/jquery.min.js')}}"></script>
	<script type="text/javascript" src="{{asset('bower_components/bootstrap/dist/js/bootstrap.min.js')}}"></script>
	<script type="text/javascript" src="{{asset('bower_components/angular/angular.min.js')}}"></script>
	<script type="text/javascript" src="{{asset('bower_components/angular-loading-bar/build/loading-bar.js')}}"></script>
	<script type="text/javascript" src="{{asset('bower_components/angular-route/angular-route.min.js')}}"></script>
	<script type="text/javascript" src="{{asset('bower_components/angular-cookies/angular-cookies.min.js')}}"></script>
	<script type="text/javascript" src="{{asset('bower_components/angular-ui-select/dist/select.js')}}"></script>

	{{--load library--}}
	<script type="text/javascript" src="{{asset('bower_components/dirPagination/dirPagination.js')}}"></script>
	<script type="text/javascript" src="{{asset('bower_components/bootstrap-datepicker/dist/js/bootstrap-datepicker.min.js')}}"></script>
	<script type="text/javascript" src="{{asset('bower_components/bootstrap-datepicker/js/locales/bootstrap-datepicker.vi.js')}}"></script>

	<script type="text/javascript" src="{{asset('js/adminhtml/app.js')}}"></script>
	<script type="text/javascript" src="{{asset('js/adminhtml/controllers.js')}}"></script>
	<script type="text/javascript" src="{{asset('js/adminhtml/models.js')}}"></script>
</body>
</html>