var API = (() => {
    var jwtToken;
    var login = () => {
        const login = document.getElementById("login").value;
        try {
            fetch("http://10.0.0.69:8080/api/v1/login", {
                method: 'POST',
                body: JSON.stringify({
                    username: login
                }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            }).then(resp => resp.json())
                .then(data => {
                    jwtToken = data.token;
                    alert("Login successful");
                    document.getElementById("login").reset();
                });
        }
        catch (e) {
            console.log(e);
            console.log("----------------------------");
        }
        return false;
    }

    var createFilm = () => {
        const movieName = document.getElementById('movieName').value;
        const movieRating = document.getElementById('movieRating').value;

        try {
            fetch("http://10.0.0.69:8080/api/v1/films", {
                method: "POST",
                body: JSON.stringify({
                    name: movieName, rating: movieRating
                }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + jwtToken
                }
            }).then(resp => {
                setTimeout(function () {
                    if (resp.status == 200) {
                        alert("Movie added!");
                    }
                    else {
                        alert("Error 403: please login before adding movie");
                    }
                })
            })

        } catch (e) {
            console.log(e);
            console.log("----------------------------");
        }
        document.getElementById("movieRater").reset();
        return false;
    }

    var getFilms = () => {
        try {
            fetch("http://10.0.0.69:8080/api/v1/films", {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }).then(resp => resp.json())
                .then(results => {
                    const ratingTable = document.getElementById("userRating").getElementsByTagName("tbody")[0];
                    ratingTable.innerHTML = '';

                    results.forEach((data, index) => {
                        const row = ratingTable.insertRow(index);
                        const cell1 = row.insertCell(0);
                        const cell2 = row.insertCell(1);
                        cell1.innerHTML = data.name;
                        cell2.innerHTML = data.rating;
                    });

                });

        } catch (e) {
            console.log(e);
            console.log("----------------------------");
        }

        return false;
    }

    var updateFilm = () => {
        const updateName = document.getElementById('updateMovie').value;
        const updateRating = document.getElementById('updateRating').value;

        try {
            fetch("http://10.0.0.69:8080/api/v1/films", {
                method: "PUT",
                body: JSON.stringify({
                    name: updateName, rating: updateRating
                }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            }).then(resp => {
                if (!resp.ok) {
                    alert("Failed to update film, please try again.");
                    return;
                }
                return resp.json();
            }).then(filmUpdate => {
                if (filmUpdate) {
                    alert("Film updated successfully.");
                }
            });

        } catch (e) {
            console.log(e);
            console.log("----------------------------");
        }
        document.getElementById("updateMovieRating").reset();
        return false;
    }

    return {
        login,
        createFilm,
        getFilms,
        updateFilm
    }
})();
