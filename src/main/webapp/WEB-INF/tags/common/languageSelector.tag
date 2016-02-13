<%@tag description="Language selector" pageEncoding="UTF-8"%>
<div class="dropdown"
     data-bb-view="ui/components/LanguageSelectorView" data-bb-view-data="${currentLanguage}">
    <button class="btn btn-default dropdown-toggle js_currentLanguage"
            type="button"
            id="languageSelector"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="true"
            style="height: 20px; width: 30px">
    </button>
    <ul class="dropdown-menu dropdown-menu-right" aria-labelledby="languageSelector">
        <li><a href="#" class="js_languageVariant" data-language="ENGLISH"><span class="flag-icon flag-icon-us"></span>
            <span class="flag_text">English</span></a></li>
        <li><a href="#" class="js_languageVariant" data-language="RUSSIAN"><span class="flag-icon flag-icon-ru"></span>
            <span class="flag_text">Русский</span></a></li>
        <li><a href="#" class="js_languageVariant" data-language="HEBREW"><span class="flag-icon flag-icon-il"></span>
            <span class="flag_text">עברית</span></a></li>
    </ul>
</div>