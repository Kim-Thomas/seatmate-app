$(document).ready(function() {
    $('input').on('keyup', function() {
        var value = $(this).val();
        if(value.length > 2) {
            var int_matches = value.match(/(\d)/);
            var chars_matches = value.match(/[a-zA-Z]/);
            if(int_matches != null && chars_matches != null) {
                $(this).parent().find('i').addClass('correct').removeClass('incorrect');
            } else {
                $(this).parent().find('i').removeClass('correct').addClass('incorrect');
            }
        } else {
            $(this).parent().find('i').removeClass('correct incorrect');
        }
    });
});