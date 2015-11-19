<%@tag description="Language selector" pageEncoding="UTF-8"%>
<div class="dropdown js_languageSelector"
     data-bb-view="ui/components/LanguageSelectorView">
    <button class="btn btn-default dropdown-toggle js_currentLanguage"
            type="button"
            id="languageSelector"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="true"
            style="height: 20px; width: 30px">
        <span class="caret"></span>
    </button>
    <ul class="dropdown-menu" aria-labelledby="languageSelector">
        <li><a href="#" class="js_languageVariant" data-language="ENGLISH"><span class="flag-icon flag-icon-us"></span>English</a></li>
        <li><a href="#" class="js_languageVariant" data-language="RUSSIAN"><span class="flag-icon flag-icon-ru"></span>Русский</a></li>
        <li><a href="#" class="js_languageVariant" data-language="HEBREW"><span class="flag-icon flag-icon-il">עברית</span></a></li>
    </ul>
</div>