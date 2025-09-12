// GitHub Authentication Check for Website Builder
// Add this to the beginning of your wb.min.js or as a separate auth.js

(function() {
    'use strict';
    
    // List of allowed GitHub usernames (add your invited users here)
    const allowedUsers = [
        'CieloVistaSoftware',          // Repository owner
        'john-doe-dev',                // Example collaborator 1
        'jane-smith-designer',         // Example collaborator 2
        'team-member-3',               // Example collaborator 3
        // Add more GitHub usernames here as you invite people
        // Format: 'their-exact-github-username',
    ];
    
    // Check if user is authenticated
    function checkGitHubAuth() {
        // Try to get GitHub user info using GitHub API
        fetch('https://api.github.com/user', {
            headers: {
                'Accept': 'application/vnd.github.v3+json'
            },
            credentials: 'include'
        })
        .then(response => {
            if (response.status === 200) {
                return response.json();
            } else {
                throw new Error('Not authenticated');
            }
        })
        .then(user => {
            if (allowedUsers.includes(user.login)) {
                console.log(`Welcome, ${user.login}!`);
                // User is authorized, continue
                return true;
            } else {
                showAccessDenied(user.login);
                return false;
            }
        })
        .catch(error => {
            showLoginRequired();
            return false;
        });
    }
    
    function showLoginRequired() {
        document.body.innerHTML = `
            <div style="text-align: center; padding: 50px; font-family: Arial;">
                <h1>🔒 GitHub Login Required</h1>
                <p>Please sign in to GitHub first, then refresh this page.</p>
                <a href="https://github.com/login" target="_blank" 
                   style="background: #333; color: white; padding: 10px 20px; 
                          text-decoration: none; border-radius: 5px;">
                    Sign in to GitHub
                </a>
            </div>
        `;
    }
    
    function showAccessDenied(username) {
        document.body.innerHTML = `
            <div style="text-align: center; padding: 50px; font-family: Arial;">
                <h1>❌ Access Denied</h1>
                <p>Sorry, @${username} is not authorized to access this application.</p>
                <p>Contact the repository owner for access.</p>
            </div>
        `;
    }
    
    // Run the check when page loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', checkGitHubAuth);
    } else {
        checkGitHubAuth();
    }
})();