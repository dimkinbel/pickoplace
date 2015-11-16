## Deploy

```
mvn clean install
mvn appengine:update
```


## I18N

### Resource file
see [src/main/resources/com/pickoplace/localization.json](src/main/resources/com/pickoplace/localization.json)

### JSP
```
${requestScope.i18n['someKey']}
```

### Java
```
import com.dimab.pickoplace.i18n.I18n;

...
I18n.get('someKey');
```

### Javascript
**script `/rest/i18n.js` must present on page!**

```
i18n('someKey');
```