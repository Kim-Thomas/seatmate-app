$(document).ready(function() {
    $('input').on('keyup', function() {
        var value = $(this).val();
        if(value.length > 0) {
            $(this).parent().find('i').addClass('correct');
        } else {
            $(this).parent().find('i').removeClass('correct');
        }
    });
});