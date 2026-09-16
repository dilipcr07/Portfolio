// Forward to js/main.js logic or execute directly
// Re-export or include the unified scripts
import('./js/certifications-data.js').then(() => import('./js/main.js')).catch(() => {
    // If not using ES modules, scripts are loaded via HTML tags
});