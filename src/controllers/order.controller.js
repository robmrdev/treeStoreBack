
const getOrders = async (req,res)=> {
    try {
        
        res.send({status: 'success', message:'getOrders'})
    } catch (error) {
        res.status(500).send ({status: 'error', message: error.message})
    }
}
const getOrderById = async (req,res)=> {
    try {
        const {id} = req.params
        
    } catch (error) {
        res.status(500).send ({status: 'error', message: error.message})
    }
}
const createOrder = async (req,res)=> {
    try {
        const {user, products } = req.body

        if(!userResult){
            return res.status(404).send({status: 'error', message: 'User Error'})
        }
    } catch (error) {
        res.status(500).send ({status: 'error', message: error.message})
    }
}

const resolveOrder = async (req,res) =>{
    try {
        const {status} = req.body;
        const { id } = req.params;
        if (!orderResult){
            return res.status(404).send({status: 'error', message: 'Order error'})
        }
    } catch (error) {
        res.status(500).send ({status: 'error', message: error.message})
    }
}

export {
    getOrders,
    getOrderById,
    createOrder,
    resolveOrder
}