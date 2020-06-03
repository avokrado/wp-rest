import { useEffect, useState } from 'react';
import WooCommerceAPI from 'woocommerce-api';

const WooCommerce = new WooCommerceAPI({
    url: 'http://studentdocker.informatika.uni-mb.si:20290/',
    consumerKey: 'ck_9b0daa383cd49845354c166825c81f6965e31512',
    consumerSecret: 'cs_de3a8d376ffd327df96df03a8195c742f5bc7f26',
    wpAPI: true,
    version: 'wc/v1'
});

export default function useFetch() {
    const [data, setData] = useState(null);
    useEffect(() => {
        async function loadData() {
            WooCommerce.get('products').then(function (result) {
                console.log(JSON.parse(result.body));
                setData(result.body);
            });
        }
        loadData();
    }, []);
    return data;
}