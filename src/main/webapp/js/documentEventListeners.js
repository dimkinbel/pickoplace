/**
 * Created by dima on 19-Nov-15.

if(typeof document.onselectstart!="undefined") {
    document.onselectstart = new Function ("return false");
} else {
    document.onmousedown = new Function ("return false");
    document.onmouseup = new Function ("return true");
}
*/