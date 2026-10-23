<?php

return [
    'allow_devtunnels' => env('ADMIN_ALLOW_DEVTUNNELS', true),
    'allowed_ips' => array_values(array_filter(array_map(
        'trim',
        explode(',', (string) env('ADMIN_ALLOWED_IPS', '')),
    ))),
];
