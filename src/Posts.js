import React, { useEffect, useState } from 'react';
import WooCommerceAPI from 'woocommerce-api';
import { useForm } from "react-hook-form";


const WooCommerce = new WooCommerceAPI({
    url: 'http://studentdocker.informatika.uni-mb.si:20290/',
    consumerKey: 'ck_9b0daa383cd49845354c166825c81f6965e31512',
    consumerSecret: 'cs_de3a8d376ffd327df96df03a8195c742f5bc7f26',
    wpAPI: true,
    version: 'wc/v1'
});

const Posts = () => {
    const [data, setData] = useState(null);
    const [coupons, setCoupons] = useState(null);
    const { register, handleSubmit, errors } = useForm();


    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        WooCommerce.get('products').then(function (result) {
            console.log(JSON.parse(result.body));
            setData(JSON.parse(result.body));
        });

        WooCommerce.get("coupons")
            .then((response) => {
                console.log(response.data);
                setCoupons(JSON.parse(response.body));
            })
            .catch((error) => {
                console.log(error.response.data);
            });
    }
    const handleNameChange = (id, e) => {
        setData(
            data.map(item => {
                if (item.id === id) {
                    return { ...item, name: e };
                } else {
                    return item;
                }
            })
        );

    };
    const handleDescriptionChange = (id, e) => {
        setData(
            data.map(item => {
                if (item.id === id) {
                    return { ...item, description: e };
                } else {
                    return item;
                }
            })
        );

    };

    const updateProduct = (id) => {
        let product = data.find(product => product.id === id);

        WooCommerce.put(`product/${id}`, product)
            .then((response) => {
                console.log(response.data);
            })
            .catch((error) => {
                console.log(error.response.data);
            });
    }

    const deleteProduct = (id) => {
        WooCommerce.delete(`products/${id}`, {
            force: true
        })
            .then((response) => {
                console.log(response.data);
                loadData();
            })
            .catch((error) => {
                console.log(error.response.data);
            });
    }

    const onSubmit = data => {
        const product = {
            name: data.name,
            type: "simple",
            regular_price: data.price,
            description: data.description,
            short_description: data.shortDescription,
            categories: [
                {
                    id: 1
                },
            ],
            images: [
                {
                    src: "http://demo.woothemes.com/woocommerce/wp-content/uploads/sites/56/2013/06/T_2_front.jpg"
                },
                {
                    src: "http://demo.woothemes.com/woocommerce/wp-content/uploads/sites/56/2013/06/T_2_back.jpg"
                }
            ]
        };
        console.log(product)
        WooCommerce.post("products", product)
            .then((response) => {
                console.log(response.data);
                loadData();
            })
            .catch((error) => {
                console.log(error.response.data);
            });
    };
    const handleCouponSubmit = data => {
        const coupon = {
            code: data.code,
            discount_type: "percent",
            amount: data.discount,
            individual_use: true,
            exclude_sale_items: true,
            minimum_amount: "100.00"
        };

        WooCommerce.post("coupons", coupon)
            .then((response) => {
                console.log(response.data);
            })
            .catch((error) => {
                console.log(error.response.data);
            });
    };
    return (
        <div className="wrapper">
            <div className="product-wrapper">
                {data && data.map((data, index) =>
                    <div key={index}>
                        <label>Name</label>
                        <input defaultValue={data.name} onChange={(e) => handleNameChange(data.id, e.target.value)} />
                        <label>Description</label>
                        <textarea defaultValue={data.description} onChange={(e) => handleDescriptionChange(data.id, e.target.value)} />
                        <button onClick={() => updateProduct(data.id)}>Update</button>
                        <button onClick={() => deleteProduct(data.id)}>Delete</button>
                    </div>
                )}
            </div>
            <div className="product-wrapper">
                Coupons:
                <ul>
                    {coupons && coupons.map((data, index) =>
                        <li key={index}>
                            Code: {data.code}, Amount: {data.amount}
                        </li>

                    )}
                </ul>
                <div className="form-wrapper">
                    <form onSubmit={handleCouponSubmit(onSubmit)}>

                        {/* register your input into the hook by invoking the "register" function */}
                        <label>Code:</label>
                        <input label="Code" name="code" ref={register({ required: true })} />
                        <input label="Discount" name="discount" ref={register({ required: true })} />

                        <input type="submit" />
                    </form>
                </div>
            </div>

            <div className="form-wrapper">
                <form onSubmit={handleSubmit(onSubmit)}>

                    {/* register your input into the hook by invoking the "register" function */}
                    <label>Name</label>
                    <input label="Name" name="name" ref={register({ required: true })} />

                    {/* include validation with required or other standard HTML validation rules */}
                    <label>Description</label>
                    <textarea label="Description" name="description" ref={register} />
                    <label>Short description</label>
                    <input label="Short description" name="shortDescription" ref={register} />
                    <label>Price</label>
                    <input label="Price" name="price" ref={register} />
                    {/* errors will return when field validation fails  */}
                    {errors.exampleRequired && <span>This field is required</span>}

                    <input type="submit" />
                </form>
            </div>
        </div >

    );
}

export default Posts;