$(document).ready(function() {
    $('input').on('keyup', function() {
        var value = $(this).val();
        var int_matches = value.match(/(\d)/);
        var chars_matches = value.match(/[a-zA-Z]/);
        if(int_matches != null && chars_matches != null) {
            $(this).parent().find('i').addClass('correct');
        } else {
            $(this).parent().find('i').removeClass('correct');
        }
    });
});