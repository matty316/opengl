workspace "OpenGLProj"
    configurations { "Debug", "Release" }
    platforms { "Win64" }

project "OpenGLProj"
    kind "ConsoleApp"
    language "C++"
    targetdir "bin/%{cfg.buildcfg}"
    cppdialect "C++23"

    files { "include/**.h", "include/**.hpp", "src/**.c", "src/**.cpp", "shaders/**.vs", "shaders/**.fs" }

    includedirs { "include" }
    includedirs { "src" }
    includedirs { "shaders" }
    libdirs { "lib" }

    links { "glfw3" }
    links { "OpenGL32" }

    filter "configurations:Debug"
    defines { "DEBUG" }
    symbols "On"

    filter "configurations:Release"
    defines { "NDEBUG" }
    optimize "On"