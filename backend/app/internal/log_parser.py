import time

def parse_logs(logs_path, time_since):
    """ 
        Assume a log format of:
        "[%(levelname)s] %(asctime)s %(name)s (%(filename)s:%(lineno)s): %(message)s"
    """
    result = []
    log_entries = []
    log_file = open(logs_path, 'r')
    all_logs = log_file.read()
    log_file.close()
    logs = all_logs.split('\n[')
    for line in logs:
        try:
            log_split = line.split(' ')
            log_time = log_split[1:3]
            log_time_string = f'{log_time[0]} {log_time[1]}'.split(',')[0]
            stripped_time = time.strptime(log_time_string, "%Y-%m-%d %H:%M:%S")
            asctime = time.mktime(stripped_time)
            if asctime > time_since:
                result.append(line)
                log_level = line.split(']')[0]
                log_name = log_split[3]
                log_file_lineno = log_split[4]
                log_file = log_file_lineno.split(":")[0]
                log_lineno = log_file_lineno.split(":")[1]
                log_message = line.split(log_file_lineno)[1]
                if len(log_file) > 0:
                    log_file = log_file[1:]
                if len(log_lineno) > 0:
                    log_lineno = log_lineno[:-1]
                if len(log_message) > 0:
                    log_message = log_message[1:]
                log_entry = {
                    "log_time": asctime,
                    "log_level": log_level,
                    "log_name": log_name,
                    "log_file": log_file,
                    "log_lineno": log_lineno,
                    "log_message": log_message,
                }
                log_entries.append(log_entry)
        except Exception as e:
            print(f'unable to parse log line: {e}')
    return log_entries