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
    // event handler for opening the note modal
    $(".note-btn").click(function (event) {
        event.preventDefault();
        const id = $(this).attr("data");
        $('#article-id').text(id);
        $('#save-note').attr('data', id);
        $.ajax("/articles/" + id, {
            type: "GET",
        }).then(function (data) {
            console.log(data)
            //     $('.articles-available').empty();
            //     if (data[0].note.length > 0) {
            //         data[0].note.forEach(v => {
            //             $('.articles-available').append($(`<li class='list-group-item'>${v.text}<button type='button' class='btn btn-danger btn-sm float-right btn-deletenote' data='${v._id}'>X</button></li>`));
            //         })
            //     }
            //     else {
            //         $('.articles-available').append($(`<li class='list-group-item'>No notes for this article yet</li>`));
            //         console.log("Second ran!")
            //     }
            // })
            $('#note-modal').modal('toggle');
        });

        // $('.btn-deletenote').click(function (event) {})
        $(document).on('click', '.btn-deletenote', function () {
            event.preventDefault();
            console.log($(this).attr("data"))
            const id = $(this).attr("data");
            console.log(id);
            $.ajax(`/notes/${id}`, {
                type: "DELETE"
            }).then(function () {
                $('#note-modal').modal('toggle');
            });
        });

        $("#save-note").click(function (event) {
            event.preventDefault();
            const id = $(this).attr('data');
            var noteTextObj = {
                body: $('#note-input').val()
            }
            console.log(noteTextObj);
            console.log(id);
            // $('#note-input').val('');
            $.ajax("/articles/" + id, {
                type: "POST",
                data: { text: noteTextObj }
            }).then(function (data) {
                console.log(data)
                // $("#notes").append(noteText);
            })
            $('#note-modal').modal('toggle');
            // $("#note-input").val("");
        });

    });
});

