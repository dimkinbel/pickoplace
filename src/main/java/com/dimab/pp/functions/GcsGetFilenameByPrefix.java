package com.dimab.pp.functions;

import com.google.appengine.tools.cloudstorage.*;

import java.io.IOException;

/**
 * Created by dima on 11-Mar-16.
 */
public class GcsGetFilenameByPrefix {
    public GcsFilename getGcsFileName(GcsService gcsService,String bucket, String prefix) {
        GcsFilename gcsFilename = new GcsFilename("","");
        ListOptions.Builder b = new ListOptions.Builder();
        b.setPrefix(prefix);
        ListResult result = null;
        try {
            result = gcsService.list(bucket, b.build());
        } catch (IOException e) {
            e.printStackTrace();
            return gcsFilename;
        }
        while (result.hasNext()){
            ListItem l = result.next();
            String name = l.getName();
            gcsFilename = new GcsFilename(bucket, name);
        }
        return gcsFilename;
    }
}
