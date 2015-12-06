package com.dimab.pickoplace.guice;

import org.reflections.Reflections;
import org.reflections.scanners.MethodAnnotationsScanner;
import org.reflections.scanners.SubTypesScanner;
import org.reflections.scanners.TypeAnnotationsScanner;

class ReflectionUtils {
    private final static String PARENT_NAMESPACE_NAME = "com.dimab.pickoplace";
    public final static Reflections PARENT_NAMESPACE_REFLECTIONS = new Reflections(PARENT_NAMESPACE_NAME,
            new TypeAnnotationsScanner(),
            new SubTypesScanner(),
            new MethodAnnotationsScanner());

    // -------------------------------------------------------
    // -                     CONSTRUCTOR                     -
    // -------------------------------------------------------

    private ReflectionUtils() {
    }
}
