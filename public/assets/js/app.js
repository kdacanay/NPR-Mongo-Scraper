$(document).ready(function () {

    $(".save-btn").click(function (event) {
        console.log(this);
        event.preventDefault();
        button = $(this);
        var id = $(this).data("id");
        var saved = {
            saved: true
        };
        console.log("okokok");
        $.ajax("/save/" + id, {
            type: "PUT",
            saved: saved
        }).then(function () {
            console.log("oksaved");
            var alert = `<div class="alert alert-warning alert-dismissible fade show" role="alert">
                Your note has been saved!
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span></button></div>`
            button.parent().append(alert);
        }
        );
    });
});


