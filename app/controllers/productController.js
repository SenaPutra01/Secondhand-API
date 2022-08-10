const { products, users, category } = require('../models');
const { Op } = require('sequelize');
const cloudinary = require('../../cloudinary/cloudinary');

module.exports = {
	async createProduct(req, res) {
		const id = req.id;

		try {
			const result = await cloudinary.uploader.upload(req.file.path);
			const data = {
				name: req.body.name,
				price: req.body.price,
				description: req.body.description,
				userId: id,
				categoryId: req.body.categoryId,
				image: result.url,
			};

			const product = await products.create(data);

			res.status(200).json({
				status: true,
				msg: 'Item succefully created',
				data: product,
			});
		} catch (err) {
			res.status(400).json({
				status: false,
				msg: err,
			});
		}
	},

	async updateProduct(req, res) {
		const id = req.id;
		try {
			const result = await cloudinary.uploader.upload(req.file.path);
			const data = {
				name: req.body.name,
				price: req.body.price,
				description: req.body.description,
				categoryId: req.body.categoryId,
				user: id,
				image: result.url,
			};

			const product = await products.update(data, { where: { id: req.params.id } });
			res.status(200).json({
				status: true,
				msg: 'Item succefully updated',
				data: product,
			});
		} catch (err) {
			res.status(400).json({
				status: false,
				msg: err,
			});
		}
	},

	async deleteProduct(req, res) {
		try {
			const id = req.id;

			await users.findByPk({ where: { id: id } });

			const item = await products.destroy({
				where: { [Op.and]: [{ id: req.params.id }, { userId: id }] },
			});

			if (!!item) {
				res.status(404).json({
					deletedBy: req.result,
					msg: 'Product not found',
				});
			}
			res.json({
				msg: 'Product successfully deleted',
			});
		} catch (error) {
			res.status(400).json({
				status: false,
				msg: error.message,
			});
		}
	},

	async getAllProduct(req, res) {
		const item = await products.findAll({
			include: [
				{
					model: users,
					attributes: ['id', 'username', 'image', 'phone', 'address', 'city'],
				},
				{
					model: category,
					attributes: ['id', 'name'],
				},
			],
		});
		const count = await products.count();

		const product = await Promise.all(item.map(async (arr) => {
			return {
				id: arr.id,
				name: arr.name,
				description: arr.description,
				price: arr.price,
				category: arr.category,
				image: arr.image,
				isSold: arr.isSold,
				createdAt: arr.createdAt,
				updatedAt: arr.updatedAt
			}
		}))
		
		res.status(200).json({
			status: true,
			count: count,
			items: product,
		});
	},

	async getProductCategory(req, res) {
		try {
			const id = req.params.id;
			const item = await products.findAll({ where: { categoryId: id } });
			const count = await products.count({ where: { categoryId: id } });

			const product = await Promise.all(item.map(async (arr) => {
				return {
					id: arr.id,
					name: arr.name,
					description: arr.description,
					price: arr.price,
					category: arr.category,
					image: arr.image,
					isSold: arr.isSold,
					createdAt: arr.createdAt,
					updatedAt: arr.updatedAt
				}
			}))

			res.status(200).json({
				status: true,
				count: count,
				items: product,
			});
		} catch (error) {
			res.status(400).json({
				status: false,
				msg: 'There is no product in this category',
			});
		}
	},

	async getProductDetail(req, res) {
		const id = req.params.id;

		try {
			const item = await products.findByPk(id, {
				include: [
					{
						model: users,
						attributes: ['username', 'image', 'address', 'city', 'phone'],
					},
					{
						model: category,
						attributes: ['id', 'name'],
					},
				],
			});

			const product = {
				id: item.id,
				name: item.name,
				description: item.description,
				price: item.price,
				category: item.category,
				image: item.image,
				isSold: item.isSold,
				user: item.user,
				createdAt: item.createdAt,
				updatedAt: item.updatedAt
			}

			res.status(200).json({
				status: true,
				msg: 'This is your item',
				data: product,
			});
		} catch (error) {
			res.status(404).json({
				status: false,
				msg: "Produk doesn't exists!",
			});
		}
	},

	async getAllSellerProduct(req, res) {
		const id = req.id;

		try {
			const user = await users.findAll({ where: { id: id } });
      		const item = await products.findAll({
				where: {
					userId: id,
				},
				include: [
					{
						model: users,
						attributes: ['id', 'username', 'image', 'phone', 'address', 'city'],
					},
					{
						model: category,
						attributes: ['id', 'name'],
					},
				],
			});
			const productCount = await products.count({ where: { userId: id } });

			
			const product = await Promise.all(item.map(async (arr) => {
				return {
					id: arr.id,
					name: arr.name,
					description: arr.description,
					price: arr.price,
					category: arr.category,
					image: arr.image,
					isSold: arr.isSold,
					user: arr.user,
					createdAt: arr.createdAt,
					updatedAt: arr.updatedAt
				}
			}))

			res.status(200).json({
				status: true,
				msg: "This is your items",
				productCount: productCount,
				product: product,
			});
		} catch (error) {
			res.status(400).json({
				status: false,
				msg: 'Sorry there is something wrong',
			});
		}
	},
};
