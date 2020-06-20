$(document).ready(function () {

    $(".save-btn").click(function (event) {
        console.log(this);
        event.preventDefault();
        button = $(this);
        const id = button.data("id");
        var saved = {
            saved: true
        };
        // console.log("okokok");
        $.ajax("/save/" + id, {
            type: "PUT",
            data: saved
        }).then(function () {
            console.log(this);
            var alert = `<div class="alert alert-warning alert-dismissible fade show" role="alert">
                Your article has been saved!
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span></button></div>`
            button.parent().append(alert);
            // $(".card w-90").attr("<div class='hidden'>");
        }
        );
    });

    $(".delete-btn").click(function (event) {
        console.log(this);
        event.preventDefault();
        const id = $(this).attr("data");
        var unSaved = {
            saved: false
        };
        console.log("ok");
        $.ajax("/remove/" + id, {
            type: "PUT",
            data: unSaved
        }).then(function () {
            console.log(this);
            $("#savedArticles").remove();
            // location.reload();
        })
    })
});


