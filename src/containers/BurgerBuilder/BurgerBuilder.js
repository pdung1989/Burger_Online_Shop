import React, {Component}  from 'react';
import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-orders';


//set initial price of each indredient
const INGREDIENT_PRICES = {
  salad: 0.5,
  cheese: 0.4,
  meat: 1.3,
  bacon: 0.7
}

class BurgerBuilder extends Component {
  // constructor (props) {
  //   super(props);
  //   this.state = {...}
  // }
  state = {
    ingredients: null,
    totalPrice: 4,
    purchasable: false,
    purchasing: false,
    loading: false,
    error: false
  }

  //fetch ingredients data from server
  componentDidMount () {
    axios.get('https://burger-builder-react-c41d4-default-rtdb.firebaseio.com/ingredients.json')
      .then(response => {
        this.setState({ingredients: response.data});
      })
      .catch(error => {
        this.setState({error: true});
      })
  }
  updatePurchaseState (ingredients) {
    const sum = Object.keys(ingredients)
      .map(igKey => {
        return ingredients[igKey];
      })
      .reduce((sum, el) => {
        return sum + el;
      }, 0)
    this.setState({purchasable: sum > 0});
  }

  addIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type];
    const updateCount = oldCount + 1;
    const updatedIngredients = {
      ...this.state.ingredients
    };
    updatedIngredients[type] = updateCount;
    const priceAddition = INGREDIENT_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice + priceAddition;
    this.setState({totalPrice: newPrice, ingredients: updatedIngredients});
    this.updatePurchaseState(updatedIngredients);
  }

  removedIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type];
    if(oldCount <= 0) {
      return;
    }
    const updateCount = oldCount - 1;
    const updatedIngredients = {
      ...this.state.ingredients
    };
    updatedIngredients[type] = updateCount;
    const priceDeduction = INGREDIENT_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice - priceDeduction;
    this.setState({totalPrice: newPrice, ingredients: updatedIngredients});
    this.updatePurchaseState(updatedIngredients);
  }

  purchaseHandler = () => {
    this.setState({purchasing: true});
  }

  purchaseCancelHandler = () => {
    this.setState({purchasing: false});
  }

  purchaseContinueHandler = () => {
    //alert('You continue!');
    this.setState({loading: true});
    const order = {
      ingredients: this.state.ingredients,
      price: this.state.totalPrice,
      customer: {
        name: 'Dung Tran',
        address: {
          street: 'Päivänkajontie',
          zipcode: '02210',
          country: 'Finland'
        },
        email: 'dtran@gmail.com'
      },
      deliveryMethod: 'fastest'
    }
    axios.post('/orders.json', order)
      .then(response => {
        this.setState({loading: false, purchasing: false})
      })
      .catch(error => {
        this.setState({loading: false, purchasing: false})
      });
  }

 render() {
   const disabledInfo = {
     ...this.state.ingredients
   }
   for (let key in disabledInfo) {
     disabledInfo[key] = disabledInfo[key] <= 0
   }
    let orderSummary = null;
    let burger = this.state.error ? <p>Ingredients can't be loaded!</p> : <Spinner />

    if(this.state.ingredients) {
      burger = (
        <Aux>
          <Burger ingredients={this.state.ingredients}/>
          <BuildControls 
            ingredientAdded={this.addIngredientHandler}
            ingredientRemoved={this.removedIngredientHandler}
            disabled={disabledInfo}
            purchasable={this.state.purchasable}
            ordered={this.purchaseHandler}
            price={this.state.totalPrice}/>
        </Aux>
      )
      orderSummary = <OrderSummary 
      price={this.state.totalPrice}
      ingredients={this.state.ingredients}
      purchaseCanceled={this.purchaseCancelHandler}
      purchaseContinued={this.purchaseContinueHandler}/>;
    };

    if(this.state.loading) {
      orderSummary = <Spinner />;
    }
    
   return (
     <Aux>
        <Modal show={this.state.purchasing} modelClosed={this.purchaseCancelHandler}>
          {orderSummary}
        </Modal>
        {burger}
     </Aux>
   );
 }
};

export default withErrorHandler(BurgerBuilder, axios);