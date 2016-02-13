
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@taglib prefix="common" tagdir="/WEB-INF/tags/common" %>
<!DOCTYPE html >
<html>
<head>
    <common:baseStyles/>
    <common:baseScripts/>
    <common:baseSyncScripts/>

    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Title</title>
    <script type="text/javascript">
        function sendAjaxTest() {
            var json_ = JSON.stringify({"bid": $("#bidinput").val(), "sid": $("#sidinput").val()});
            console.log(json_);
            $.ajax({
                url: "/adminRequest/cancelReservation",
                data:json_,//
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                success: function (data) {
                    console.log("Resplone");
                    console.log(data);

                },
                dataType: "json",
                type: "POST"
            });
        }
    </script>

</head>
<body>
<input id="bidinput" type="text"/>
<input id="sidinput" type="text"/>
<button onclick="sendAjaxTest();">Send ajax</button>
</body>
</html>
