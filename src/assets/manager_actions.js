window.onload = function () {
    var controller_url = '';
    //tasks list page
    $('.run_task').click(function () {
        runTask({id: $(this).attr('id')});
        return false;
    });
    $('#select_all').change(function () {
        if ($(this).prop('checked'))
            $('.task_checkbox').prop('checked', 'checked');
        else
            $('.task_checkbox').prop('checked', '');
    });
    $('#execute_action').click(function () {
        var action = $('#action').find('option:selected').val();
        var tasks = $('.task_checkbox:checked').map(function () {
            return $(this).val();
        }).get();
        if ('Run' == action) {
            runTask({id: tasks});
            return false;
        } else {
            return true;
        }
    });
    $('.show_output').click(function () {
        $('#output_container').html('Loading...');
        $.post(controller_url + 'get-output', {task_run_id: $(this).attr('data-task-run-id')}, function (data) {
            $('#output_container').html(data);
            return false;
        });
    });
    $('#run_custom_task').click(function () {
        runTask({custom_task: $('#command').val()});
        return false;
    });

    function runTask(data) {
        if (confirm('Are you sure?')) {
            $('#output_section').show();
            $('#task_output_container').text('Running...');
            $.post(controller_url + 'run-task', data, function (data) {
                $('#task_output_container').html(data);
            }).fail(function (xhr, textStatus, errorThrown) {
                alert(xhr.responseText);
            });
        }
    }

    //edit page
    $('#method').change(function () {
        $('#task-command').val($(this).val());
    });

    function getRunDates() {
        $.post(controller_url + 'get-dates', {time: $('#task-time').val()}, function (data) {
            $('#dates_list').html(data);
        })
    }

    var $time = $('#task-time');
    $time.change(function () {
        getRunDates();
    });
    if ($time.length)
        getRunDates();

    $('#times').change(function () {
        $time.val($(this).val());
        getRunDates();
    });

    //export page
    $('#parse_crontab_form').submit(function () {
        $.post(controller_url + 'parse-crontab', $(this).serialize(), function (data) {
            var list = '';
            data.forEach(function (element) {
                element.forEach(function (el) {
                    list += '' + el + '<br>';
                });
                list += '<hr>';
            });
            $('#parse_result').html(list);
        }, 'json');
        return false;
    });
    $('#export_form').submit(function () {
        $.post(controller_url + 'export-tasks', $(this).serialize(), function (data) {
            var list = '';
            data.forEach(function (element) {
                list += '' + element + '<br>';
            });
            $('#export_result').html(list);
        }, 'json');
        return false;
    });
};