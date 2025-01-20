workspace "OpenGLProj"
    configurations { "Debug", "Release" }
    platforms { "Win64" }

project "OpenGLProj"
    kind "ConsoleApp"
    language "C++"
    targetdir "bin/%{cfg.buildcfg}"
    cppdialect "C++23"

    files { "include/**.h", "src/**.c", "src/**.cpp" }

    includedirs { "include" }
    includedirs { "src" }
    libdirs { "lib" }

    links { "glfm3" }

    filter "configurations:Debug"
    defines { "DEBUG" }
    symbols "On"

    filter "configurations:Release"
    defines { "NDEBUG" }
    optimize "On"