
function userInformationHTML(user) {
    return `
        <h2>${user.name}
            <span class="small-name">
            (@<a href="${user.html_url}" target="blank">${user.login}</a>)
            </span>
        </h2>
        <div class="gh-content">
            <div class="gh-avatar">
                <a href="${user.html_url}" target="_blank">
                    <img src="${user.avatar_url}" width="80" height="80" alt="${user.login}" />
                </a>
            </div>
            <p>
                Followers: ${user.followers} - Following ${user.following} <br> Repos: ${user.public_repos}
            </p>
        </div>`
};


function repoInformationHTML() {
    if (repos.length == 0) {
        return `<div class="clearfix repo-list">No repos!</div>`;
    }

    let listItemsHTML = repos.map((repo) => {
        return `<li>
                    <a href="${repo.html_url}" target="_blank">${repo.name}</a>
                </li>`
    })

    return `<div class="clearfix repo-list">
                <p>
                    <strong>Repo List:</strong>
                </p>
                <ul>
                    ${listItemsHTML.join("\n")}
                </ul>
            </div>`
}


/* Using jquery 'when' and 'then' to create a promise*/ 
function fetchGitHubInformation(event) {
    $("#gh-user-data").html("");
    $("#gh-repo-data").html("");
    const username = $('#gh-username').val();
    if(!username) {
        $('#gh-user-data').html(`<h2>Please enter a GitHub username</h2>`);
        return;
    }

    $('#gh-user-data').html(
        `<div id="loader">
            <img src="assets/css/loader.gif" alt="loading"/>
        </div>`);
        // using .getJSON to query the github API.
        $.when(
            $.getJSON(`https://api.github.com/users/${username}`),
            $.getJSON(`https://api.github.com/users/${username}/repos`)
        ).then(
            //anonomous function that takes the response as a parameter
            function (response, secondResponse){
                const userData = response[0];
                const repoData = secondResponse[0];
                $("#gh-user-data").html(userInformationHTML(userData));
                $("#gh-repo-data").html(repoInformationHTML(repoData));
            }, function(errorResponse){
                if (errorResponse.status === 404) {
                    $('#gh-user-data').html(`<h2>No info found for user ${username}</h2>`);
                } else if (errorResponse.status === 403) {
                    let resetTime = new Date(errorResponse.getResponseHeader('X-RateLimit-Reset')* 1000);
                    $('#gh-user-data').html(`<h4>Too many requests, please wait until ${resetTime.toLocaleTimeString()}</h4>`);
                } else {
                    console.log(errorResponse);
                    $('#gh-user-data').html(`<h2>Error: ${errorResponse.responseJSON.message}</h2>`);
                }
            })
}

$(document).ready(fetchGitHubInformation);