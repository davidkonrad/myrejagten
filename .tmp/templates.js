angular.module('myrejagtenApp').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('app/account/login/login.html',
    "<div class=container><div class=row><div class=col-sm-12><h1>Login</h1></div><div class=col-sm-12><form class=form name=form ng-submit=login(form) novalidate><div class=form-group><label>Email</label><input type=email name=email class=form-control ng-model=user.email required autofocus></div><div class=form-group><label>Password</label><input type=password name=password class=form-control ng-model=user.password required> <span class=\"pull-right small\"><input type=checkbox id=rememberMe ng-checked=user.rememberMe ng-model=user.rememberMe><label for=rememberMe class=rememberMe>Husk mig</label></span></div><div class=\"form-group has-error\"><p class=help-block ng-show=\"form.email.$error.required && form.password.$error.required && submitted\">Please enter your email and password.</p><p class=help-block ng-show=\"form.email.$error.email && submitted\">Please enter a valid email.</p><p class=help-block>{{ errors.other }}</p></div><div><button class=\"btn btn-inverse btn-lg btn-login\" type=submit>Login</button></div></form></div></div></div>"
  );


  $templateCache.put('app/account/settings/settings.html',
    "<div class=container><div class=row><div class=col-sm-12><h1>Change Password</h1></div><div class=col-sm-12><form class=form name=form ng-submit=changePassword(form) novalidate><div class=form-group><label>Current Password</label><input type=password name=password class=form-control ng-model=user.oldPassword mongoose-error autofocus><p class=help-block ng-show=form.password.$error.mongoose>{{ errors.other }}</p></div><div class=form-group><label>New Password</label><input type=password name=newPassword class=form-control ng-model=user.newPassword ng-minlength=3 required><p class=help-block ng-show=\"(form.newPassword.$error.minlength || form.newPassword.$error.required) && (form.newPassword.$dirty || submitted)\">Password must be at least 3 characters.</p></div><p class=help-block>{{ message }}</p><button class=\"btn btn-lg btn-primary\" type=submit>Save changes</button></form></div></div></div>"
  );


  $templateCache.put('app/account/signup/signup.html',
    "<div class=container><div class=row><div class=col-sm-12><h1>Sign up</h1></div><div class=col-sm-12><form class=form name=form ng-submit=register(form) novalidate><div class=form-group ng-class=\"{ 'has-success': form.name.$valid && submitted,\n" +
    "                                            'has-error': form.name.$invalid && submitted }\"><label>Name</label><input name=name class=form-control ng-model=user.name required><p class=help-block ng-show=\"form.name.$error.required && submitted\">A name is required</p></div><div class=form-group ng-class=\"{ 'has-success': form.email.$valid && submitted,\n" +
    "                                            'has-error': form.email.$invalid && submitted }\"><label>Email</label><input type=email name=email class=form-control ng-model=user.email required mongoose-error><p class=help-block ng-show=\"form.email.$error.email && submitted\">Doesn't look like a valid email.</p><p class=help-block ng-show=\"form.email.$error.required && submitted\">What's your email address?</p><p class=help-block ng-show=form.email.$error.mongoose>{{ errors.email }}</p></div><div class=form-group ng-class=\"{ 'has-success': form.password.$valid && submitted,\n" +
    "                                            'has-error': form.password.$invalid && submitted }\"><label>Password</label><input type=password name=password class=form-control ng-model=user.password ng-minlength=3 required mongoose-error><p class=help-block ng-show=\"(form.password.$error.minlength || form.password.$error.required) && submitted\">Password must be at least 3 characters.</p><p class=help-block ng-show=form.password.$error.mongoose>{{ errors.password }}</p></div><div><button class=\"btn btn-inverse btn-lg btn-login\" type=submit>Sign up</button> <a class=\"btn btn-default btn-lg btn-register\" href=/login>Login</a></div><hr><div><a class=\"btn btn-facebook\" href=\"\" ng-click=\"loginOauth('facebook')\"><i class=\"fa fa-facebook\"></i> Connect with Facebook</a> <a class=\"btn btn-google-plus\" href=\"\" ng-click=\"loginOauth('google')\"><i class=\"fa fa-google-plus\"></i> Connect with Google+</a> <a class=\"btn btn-twitter\" href=\"\" ng-click=\"loginOauth('twitter')\"><i class=\"fa fa-twitter\"></i> Connect with Twitter</a></div></form></div></div><hr></div>"
  );


  $templateCache.put('app/admin/admin.html',
    "<div class=container><div bs-tabs><div bs-pane data-title=\"Basis artsliste\"><div ng-include=\"'app/admin/taxon.tab.html'\"></div></div><div bs-pane data-title=Fag></div><div bs-pane data-title=Klassetrin></div></div></div>"
  );


  $templateCache.put('app/admin/password.modal.html',
    "<div class=\"modal ng-scope top am-fade-and-slide-top\" tabindex=-1 role=dialog style=\"display: block\"><div class=modal-dialog><div class=modal-content><div class=modal-header>Edit password</div><div class=modal-body><form><input id=new-password class=form-control placeholder=\"Enter password\" ng-minlength=4 ng-maxlength=30 autofocus ng-enter=\"updatePassword(); $hide();\"><br><button type=button class=\"btn btn-danger\" ng-click=$hide()><i class=\"fa fa-times\"></i>&nbsp;Cancel</button> <button type=button class=\"btn btn-success\" ng-click=\"updatePassword(); $hide()\"><i class=\"fa fa-check\"></i>&nbsp;OK</button></form></div></div></div></div>"
  );


  $templateCache.put('app/admin/taxon.tab.html',
    "<style>td.check-col {\n" +
    "\tcolor:red;\n" +
    "\tmax-width: 40px !important;\n" +
    "\twidth: 40px !important;\n" +
    "\ttext-align: center;\n" +
    "}\n" +
    "table {\n" +
    "\tmax-width: 600px !important;\n" +
    "}\t\n" +
    "td.artsgruppe {\n" +
    "\tfont-size: 90%;\n" +
    "\tpadding: 0px;\n" +
    "}\n" +
    "\n" +
    "td.info-head {\n" +
    "\tfont-size: 80%;\n" +
    "\tpadding-right: 7px;\n" +
    "}\n" +
    "td.info-content {\n" +
    "\twhite-space: nowrap;\n" +
    "}\n" +
    "b.dk {\n" +
    "\tfont-weight: normal;\n" +
    "\ttext-transform: lowercase;\n" +
    "\tcolor: navy;\n" +
    "}</style><script type=text/ng-template id=popover.taxon.html><div class=\"popover\" style=\"width:300px;\">\n" +
    "  <div class=\"arrow\"></div>\n" +
    "  <div class=\"popover-content\" ng-model=\"content\">\n" +
    "\t\t<table>\n" +
    "\t\t\t<tr><td class=\"info-content\" colspan=\"2\">Artsgruppe: {{ artInfo.Artsgruppe_dk }}</td></tr>\n" +
    "\t\t\t<tr><td class=\"info-head\">Rige</td><td class=\"info-content\"><em> {{ artInfo.Rige | lowercase }}</em>  <b class=\"dk\">{{ artInfo.Rige_dk }}</b></td></tr>\n" +
    "\t\t\t<tr><td class=\"info-head\">Række</td><td class=\"info-content\"><em>{{ artInfo.Raekke | lowercase}}</em>  <b class=\"dk\">{{ artInfo.Raekke_dk }}</b></td></tr>\n" +
    "\t\t\t<tr><td class=\"info-head\">Orden</td><td class=\"info-content\"><em>{{ artInfo.Orden | lowercase}}</em>  <b class=\"dk\">{{ artInfo.Orden_dk }}</b></td></tr>\n" +
    "\t\t\t<tr><td class=\"info-head\">Klasse</td><td class=\"info-content\"><em>{{ artInfo.Klasse | lowercase}}</em>  <b class=\"dk\">{{ artInfo.Klasse_dk }}</b></td></tr>\n" +
    "\t\t\t<tr><td class=\"info-head\">Familie</td><td class=\"info-content\"><em>{{ artInfo.Familie | lowercase}}</em>  <b class=\"dk\">{{ artInfo.Familie_dk }}</b></td></tr>\n" +
    "\t\t\t<tr><td class=\"info-head\">Slægt</td><td class=\"info-content\"><em>{{ artInfo.Slaegt | lowercase}}</em>  <b class=\"dk\">{{ artInfo.Slaegt_dk }}</b></td></tr>\n" +
    "\n" +
    "\t\t</table>\n" +
    "  </div>\n" +
    "</div></script><br><table class=\"table table-condensed\"><thead><tr><th></th><th>Navn</th><th>Dansk navn</th><th></th></tr></thead><tbody><tr class=success><td><button type=button class=\"btn btn-primary\" title=\"Tilføj art til basisliste\" ng-click=taxonCreate()><i class=\"fa fa-plus\"></i></button></td><td><input allearter-typeahead at-taxon=taxon ng-model=taxon.Videnskabeligt_navn class=form-control></td><td><input allearter-typeahead=dk at-taxon=taxon ng-model=taxon.Dansk_navn class=form-control id=new-taxon></td><td><button type=button class=\"btn btn-primary current-taxon\" bs-popover data-trigger=hover data-html=true data-template-url=popover.taxon.html><i class=\"fa fa-info\"></i></button></td></tr></tbody><tbody ng-repeat=\"(artsgruppe, arter) in taxons\"><tr class=active><td colspan=4 class=artsgruppe>{{ artsgruppe }}</td></tr><tr ng-repeat=\"(index, art) in taxons[artsgruppe]\"><td class=check-col><input type=checkbox ng-model=art.taxon_basisliste title=\"Medtag i basisliste\" ng-click=basislisteToggle(art)></td><td>{{ art.taxon_navn }}</td><td>{{ art.taxon_navn_dk }}</td><td style=text-align:right><button type=button class=\"btn btn-primary btn-xs\">&nbsp;<i class=\"fa fa-info\"></i>&nbsp;</button></td></tr></tbody></table>"
  );


  $templateCache.put('app/alert/alert.modal.html',
    "<div class=\"modal ng-scope top am-fade-and-slide-top center\" tabindex=-1 role=dialog style=\"display: block\" id=modal-alert><div class=modal-dialog><div class=modal-content><div class=modal-header><h4 class=modal-title>{{ alertParams.title }}</h4></div><div class=modal-body><i class=\"fa fa-warning\" style=font-size:300%></i> <span class=text ng-bind-html=alertParams.message></span></div><div class=modal-footer><button type=button class=\"btn btn-success\" ng-click=alertModalClose(true)>Fortsæt</button> <button type=button class=\"btn btn-default\" ng-click=alertModalClose(false)>Fortryd</button></div></div></div></div>"
  );


  $templateCache.put('app/brugerkonto/brugerkonto.html',
    "<div class=container><h2>Mine forsøg</h2><button role=button class=\"btn btn-success\" ng-click=createForsoeg()>Opret nyt forsøg</button></div>"
  );


  $templateCache.put('app/createuser/createuser.html',
    "<div class=container><h2>Opret bruger</h2><form class=\"form-horizontal col-sm-6\"><div class=form-group><label for=email class=\"col-sm-2 control-label\">Email</label><div class=col-sm-10><input type=email class=form-control id=email placeholder=Email></div></div><div class=form-group><label for=username class=\"col-sm-2 control-label\">Brugernavn</label><div class=col-sm-10><input class=form-control id=username placeholder=brugernavn></div></div><div class=form-group><div class=\"col-sm-offset-2 col-sm-10\"><button type=submit class=\"btn btn-default\">Send anmodning</button></div></div></form></div>"
  );


  $templateCache.put('app/forsoeg/forsoeg.html',
    "<div class=container><h2>Oversigt over forsøg</h2></div>"
  );


  $templateCache.put('app/forsoegModal/forsoegModal.modal.html',
    "<div class=\"modal ng-scope top am-fade-and-slide-top center\" tabindex=-1 role=dialog style=\"display: block\" id=forsoeg-modal><div class=modal-dialog><div class=modal-content><div class=modal-header><button type=button class=close ng-click=$hide()>×</button><h4 class=modal-title>Opret nyt forsøg</h4></div><div class=modal-body><div class=form-group></div><div class=modal-footer><button type=button class=\"btn btn-default\" ng-click=kommentarModalCancel()>Fortryd</button> <button type=button class=\"btn btn-success\" ng-click=kommentarModalOk()>Ok</button></div></div></div></div></div>"
  );


  $templateCache.put('app/main/main.html',
    "<br><div class=container><div class=col-sm-12><div class=\"col-md-9 no-float\" style=\"min-height:100% !important;height:100%;font-size:18px\">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.<h3>Billeder, tekst, links etc</h3></div><div class=\"col-md-3 no-float\" style=\"border-bottom:1px solid #dadada\"><h4>Allerede <b>myrejæger</b>?</h4><div class=form-group><input ng-model=login.brugernavn class=\"form-control input-sm bold xno-padding\" placeholder=\"Brugernavn\"> <input type=password ng-model=login.password class=\"form-control input-sm bold xno-padding\" placeholder=Password style=\"margin-top:7px\"> <button class=\"btn btn-xs\" style=float:left;margin-top:4px>Login</button><div class=checkbox style=float:right;margin-top:1px><label><span style=padding-right:30px>Husk mig</span> <input type=checkbox></label></div></div></div><div class=\"col-md-3 no-float\" style=clear:none;float:right><h4>Tilmeld dig Myrejagten</h4>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</div></div><h2>Myrejagten forside</h2><ul><li>baggrund</li><li>kort, oversigt over undersøgte steder</li><li>seneste fund mv</li></ul></div>"
  );


  $templateCache.put('app/mypage/mypage.html',
    "<div class=container><h2>Mine forsøg</h2><button role=button class=\"btn btn-success\" ng-click=createForsoeg()>Opret nyt forsøg</button></div>"
  );


  $templateCache.put('app/proeveNr/proeveNr.modal.html',
    "<div class=\"modal ng-scope top am-fade-and-slide-top center\" tabindex=-1 role=dialog style=\"display: block\" id=modal-proeveNr><div class=modal-dialog><div class=modal-content><div class=modal-header><h4 class=modal-title>{{ proeveNrModal.title }}</h4></div><div class=modal-body><label class=\"control-label normal\" for=input>{{ proeveNrModal.message }}</label><div class=\"form-group has-success has-feedback\" id=modal-proeveNr-input><input class=\"form-control bold\" ng-model=proeveNrModal.proeve_nr id=input aria-describedby=inputStatus> <span class=\"glyphicon glyphicon-ok form-control-feedback\" id=modal-proeveNr-glyph aria-hidden=true></span> <span id=inputStatus class=sr-only>(warning)</span></div><span class=text-danger id=modal-proeveNr-exists style=display:none>prøveNr <b>{{ proeveNrModal.proeve_nr }}</b> er optaget!</span> <span class=checkbox id=modal-proeveNr-create style=display:none;margin-top:1px><label class=normal style=padding-left:0px;font-size:85%><input type=checkbox ng-model=\"proeveNrModal.willCreate\"> Opret prøve med Prøvenr. <b>{{ proeveNrModal.proeve_nr }}</b></label></span></div><div class=modal-footer><button type=button class=\"btn btn-default\" ng-click=proeveNrClose(false)>Fortryd</button> <button type=button class=\"btn btn-success\" ng-disabled=!proeveNrModal.canSubmit ng-click=proeveNrClose(true)>OK</button></div></div></div></div>"
  );


  $templateCache.put('app/projekt/projekt.html',
    "<div class=container><h2>Mine forsøg</h2><button role=button class=\"btn btn-success\" ng-click=createForsoeg()>Opret nyt forsøg</button></div>"
  );


  $templateCache.put('app/sagsNo/sagsNo.modal.html',
    "<div class=\"modal ng-scope top am-fade-and-slide-top center\" tabindex=-1 role=dialog style=\"display: block\" id=modal-sagsNo><div class=modal-dialog><div class=modal-content><div class=modal-header><h4 class=modal-title>{{ sagsNoModal.title }}</h4></div><div class=modal-body><label class=\"control-label normal\" for=input>{{ sagsNoModal.message }}</label><div class=\"form-group has-success has-feedback\" id=modal-sagsNo-input><input class=\"form-control bold\" ng-model=sagsNoModal.sagsNo id=input aria-describedby=inputStatus> <span class=\"glyphicon glyphicon-ok form-control-feedback\" id=modal-sagsNo-glyph aria-hidden=true></span> <span id=inputStatus class=sr-only>(warning)</span></div><span class=text-danger id=modal-sagsNo-exists style=display:none>sagsNr <b>{{ sagsNoModal.sagsNo }}</b> er optaget!</span> <span class=checkbox id=modal-sagsNo-create style=display:none;margin-top:1px><label class=normal style=padding-left:0px;font-size:85%><input type=checkbox ng-model=\"sagsNoModal.willCreate\"> Opret prøve med Prøvenr. <b>{{ sagsNoModal.sagsNo }}</b></label></span></div><div class=modal-footer><button type=button class=\"btn btn-default\" ng-click=sagsNoClose(false)>Fortryd</button> <button type=button class=\"btn btn-success\" ng-disabled=!sagsNoModal.canSubmit ng-click=sagsNoClose(true)>OK</button></div></div></div></div>"
  );


  $templateCache.put('app/tilmeld/tilmeld.html',
    "<div class=container><h3>Tilmeld dig Myrejagten</h3><div class=col-md-8><p>bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla</p></div><div class=col-md-6><form class=form-horizontal action=\"\" method=POST><fieldset><div class=control-group><label class=control-label for=username>Brugernavn</label><div class=controls><input id=username name=username placeholder=\"\" class=\"form-control input-lg\"><p class=help-block>Dit navn på myrejagten. Kan indeholde bogstaver, tal og mellemrum.</p></div></div><div class=control-group><label class=control-label for=email>E-mail adresse</label><div class=controls><input type=email id=email name=email placeholder=\"\" class=\"form-control input-lg\"><p class=help-block>En gyldig emailadresse der benyttes som login. Der vil blive sendt en bekræftelsesmail til adressen.</p></div></div><div class=control-group><label class=control-label for=password>Password</label><div class=controls><input type=password id=password name=password placeholder=\"\" class=\"form-control input-lg\"><p class=help-block>Password skal være mindst 3 karakterer lang, men ellers er der ingen regler</p></div></div><div class=control-group><!-- Button --><div class=controls><button class=\"btn btn-success\">Register</button></div></div></fieldset></form></div><div class=col-md-6>aasdasdasdasd</div></div>"
  );


  $templateCache.put('components/footer/footer.html',
    "<footer class=footer><div class=container><p>Myrejagten 0.0.0 | Natural History Museum of Denmark | <a href=https://github.com/davidkonrad/myrejagten/issues>Issues</a></p></div></footer>"
  );


  $templateCache.put('components/navbar/navbar.html',
    "<img src=http://cms.ku.dk/grafik/images/topgrafik/faelles.svg style=\"height:87px;width:61px;position:absolute;left:20px;top: 20px\"><div style=\"position:absolute;top:98px;border-top:1px solid maroon;min-width:100%\"></div><div class=\"navbar XXXnavbar-default navbar-static-top navbar-snm\" ng-controller=NavbarCtrl><div class=container-fluid><div class=navbar-header><button class=navbar-toggle type=button ng-click=\"isCollapsed = !isCollapsed\"><span class=sr-only>Toggle navigation</span> <span class=icon-bar></span> <span class=icon-bar></span> <span class=icon-bar></span></button><h1 style=padding-left:125px;color:#252525;padding-top:15px>Myrejagten</h1></div><div collapse=isCollapsed class=\"navbar-collapse collapse\" id=navbar-main><!--\n" +
    "      <ul class=\"nav navbar-nav\">\n" +
    "        <li ng-class=\"{ active: isActive('/opret-bruger')}\"><a href=\"/opret-bruger\">Opret bruger</span></a></li>\n" +
    "        <li ng-show=\"isLoggedIn()\" ng-class=\"{ active: isActive('/forsøg')}\"><a href=\"/forsøg\">Forsøg</span></a></li>\n" +
    "        <li ng-show=\"isLoggedIn()\" ng-class=\"{ active: isActive('/mine-forsøg')}\"><a href=\"/mine-forsøg\">Mine forsøg</span></a></li>\n" +
    "      </ul>\n" +
    "\t\t\t--><ul class=\"nav navbar-nav navbar-right\"><li><a href=/forside>Forside</a></li><li><a href=/tilmeld>Tilmeld</a></li><li><a href=/brugerkonto>Min brugerkonto</a></li><li><a href=/mine-eksperimenter>Mine eksperimenter</a></li><li><a href=/forside>Forsøg</a></li><li ng-hide=isLoggedIn() ng-class=\"{active: isActive('/login')}\"><a href=/login>Log af</a></li><li ng-show=isLoggedIn()><p class=navbar-text>Bruger: <strong>{{ getCurrentUser().name }}</strong></p></li><li ng-show=isLoggedIn() ng-class=\"{active: isActive('/logout')}\"><a href=\"\" ng-click=logout()>Log af</a></li></ul></div></div></div>"
  );

}]);
