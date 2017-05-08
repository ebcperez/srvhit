
$(document).ready(() => {
    $('.deleteUser').on('click', deleteUser)
})
function deleteUser() {
    let confirmation = confirm('Are you sure?')
    if (confirmation) {
        $.ajax({
            type: 'DELETE',
            url: '/student/delete_bookmark/' + $(this).data('id'),
        }).done(function (response) {
            window.location.replace('/')
        })
    } else {
        return false
    }
}