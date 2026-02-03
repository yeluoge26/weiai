package com.welove.app.ui.theme

import android.app.Activity
import android.os.Build
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.dynamicDarkColorScheme
import androidx.compose.material3.dynamicLightColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalView
import androidx.core.view.WindowCompat

private val LightColorScheme = lightColorScheme(
    primary = Pink500,
    onPrimary = Slate50,
    primaryContainer = Pink100,
    onPrimaryContainer = Pink900,
    secondary = Purple500,
    onSecondary = Slate50,
    secondaryContainer = Purple100,
    onSecondaryContainer = Purple900,
    tertiary = Info,
    onTertiary = Slate50,
    background = Slate50,
    onBackground = Slate900,
    surface = Slate50,
    onSurface = Slate900,
    surfaceVariant = Slate100,
    onSurfaceVariant = Slate700,
    error = Error,
    onError = Slate50,
    outline = Slate300,
    outlineVariant = Slate200,
)

private val DarkColorScheme = darkColorScheme(
    primary = Pink400,
    onPrimary = Pink900,
    primaryContainer = Pink800,
    onPrimaryContainer = Pink100,
    secondary = Purple400,
    onSecondary = Purple900,
    secondaryContainer = Purple800,
    onSecondaryContainer = Purple100,
    tertiary = Info,
    onTertiary = Slate900,
    background = Slate900,
    onBackground = Slate50,
    surface = Slate900,
    onSurface = Slate50,
    surfaceVariant = Slate800,
    onSurfaceVariant = Slate300,
    error = Error,
    onError = Slate50,
    outline = Slate600,
    outlineVariant = Slate700,
)

@Composable
fun WeLoveTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    dynamicColor: Boolean = false,
    content: @Composable () -> Unit
) {
    val colorScheme = when {
        dynamicColor && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S -> {
            val context = LocalContext.current
            if (darkTheme) dynamicDarkColorScheme(context) else dynamicLightColorScheme(context)
        }
        darkTheme -> DarkColorScheme
        else -> LightColorScheme
    }

    val view = LocalView.current
    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as Activity).window
            window.statusBarColor = colorScheme.surface.toArgb()
            WindowCompat.getInsetsController(window, view).isAppearanceLightStatusBars = !darkTheme
        }
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}
