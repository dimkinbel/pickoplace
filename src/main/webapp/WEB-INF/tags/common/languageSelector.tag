<%@tag description="Language selector" pageEncoding="UTF-8"%>
<div class="dropdown js_languageSelector">
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
        <li><a href="#" class="js_languageVariant" data-language="ENGLISH"><span class="flag flag-icon-background flag-icon-en">ENGLISH</span></a></li>
        <li><a href="#" class="js_languageVariant" data-language="RUSSIAN"><span class="flag flag-icon-background flag-icon-ru">RUSSIAN</span></a></li>
        <li><a href="#" class="js_languageVariant" data-language="HEBREW"><span class="flag flag-icon-background flag-icon-il">HEBREW</span></a></li>
    </ul>
</div>
<script type="text/javascript" src="/js/components/languageSelector.js"></script>