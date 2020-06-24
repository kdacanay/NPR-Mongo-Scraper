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
            var alert = `<br><br><div class="alert" role="alert">
                Your article has been saved!
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span></button></div>`
            button.parent().append(alert);
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
        })
    })
    // event handler for opening the note modal
    $(".note-btn").click(function (event) {
        event.preventDefault();
        const id = $(this).attr("data");
        $('#article-id').text(id);
        $('#save-note').attr('data', id);
        $.ajax("/articles/" + id, {
            type: "GET",
        }).then(function (data) {
            console.log(data);
            if (data.note) {
                $(".notes-available").empty();
                var noteBody = data.note.body;
                var noteId = data.note._id;
                $(".notes-available").append("<li class='list-group-item'>" + noteBody + "<button type='button' class='btn btn-danger btn-sm float-right deletenote' data=" + noteId + "'>X</button></li>")
            };
            $('#note-modal').modal('toggle');
        });
    });

    $(document).on('click', '.deletenote', function () {
        event.preventDefault();
        console.log($(this).attr("data"))
        const id = $(this).attr("data");
        console.log(id);
        $.ajax("/note/" + id, {
            type: "DELETE"
        }).then(function () {
            $('#note-modal').modal('toggle');
            location.reload();
        });
    });

    $("#save-note").click(function (event) {
        event.preventDefault();
        const id = $(this).attr('data');
        var noteText = $('#note-input').val()
        console.log(noteText);
        console.log(id);
        // $('#note-input').val('');
        $.ajax("/note/" + id, {
            type: "POST",
            data: { body: noteText }
        }).then(function (data) {
            console.log(data);
            $('#note-input').val("");
            // $("#notes").append(noteText);
        })
        $('#note-modal').modal('toggle');
        // $("#note-input").val("");
    });

    $(".delete-article").click(function (event) {
        event.preventDefault();
        const id = $(this).attr('data');
        $.ajax("/articles/" + id, {
            type: "DELETE"
        }).then(function (data) {
            console.log(data);
            location.reload();
        })
    });

});


