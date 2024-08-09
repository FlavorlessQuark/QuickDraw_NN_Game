char * convert (const char *str ) {
    // assuming it starts with Ox and it's all lowercase

    int count = 0;
    long num = 0;
    long exp = 1;
    for (int i = 2; str[i]; ++i) {
        if (str[i] >= 'a') {
            num += (str[i] - 'a' + 10) * exp;
            ++count;
        }
        else
            num +=( str[i] - '0') * 16;
        exp *= 16;
        ++count;
    }

    char *res = malloc(count);

    for (int i = count - 1; i >= 0; --i) {
        res[i] = (num % 10) + '0';
        num /= 10;
    }
    return res;
}
