import React from 'react';
import {
  AsyncStorage,
  Button,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';

export default class App extends React.Component {
  state = {
    spendingInput: '',
    budgetInput: '',
    budget: 0,
    todaySpending: 0,
    monthlySpending: 0
  };

  async componentDidMount() {
    try {
      const budget = await AsyncStorage.getItem('BUDGET');
      const todaySpending = await AsyncStorage.getItem('TODAY');
      this.setState({ budget, todaySpending });
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    const { spendingInput, budgetInput, budget, todaySpending } = this.state;
    return (
      <View style={styles.container}>
        <View>
          <Text>Target Budget</Text>
          {budget ? (
            <Text>{budget}</Text>
          ) : (
            <TextInput
              style={{
                height: 20,
                width: 100,
                borderColor: 'gray',
                borderWidth: 1
              }}
              onChangeText={this.onChangeBudget}
              onSubmitEditing={this.onSubmitBudget}
              value={budgetInput}
            />
          )}
          <Button onPress={this.onResetBudget} title="Reset" />
        </View>
        <View style={{ marginTop: 5 }}>
          <Text>{`Today's Spending`}</Text>
          {!!todaySpending && <Text>{todaySpending}</Text>}
          <View>
            <TextInput
              style={{
                height: 20,
                width: 100,
                borderColor: 'gray',
                borderWidth: 1
              }}
              onChangeText={this.onChangeAddSpending}
              value={spendingInput}
            />
            <Button onPress={this.onAddSpending} title="+ Add" />
            <Button onPress={this.onSubtractSpending} title="- Subtract" />
          </View>
        </View>
      </View>
    );
  }

  onChangeAddSpending = number => {
    this.setState({ spendingInput: number });
  };

  onAddSpending = async number => {
    const { todaySpending, spendingInput } = this.state;
    try {
      await AsyncStorage.setItem(
        'TODAY',
        String(Number(todaySpending) + Number(spendingInput))
      );
      this.setState(state => ({
        todaySpending: Number(todaySpending) + Number(spendingInput),
        spendingInput: 0
      }));
    } catch (error) {
      console.error(error);
    }
  };

  onSubtractSpending = async number => {
    const { todaySpending, spendingInput } = this.state;
    try {
      await AsyncStorage.setItem(
        'TODAY',
        String(Number(todaySpending) - Number(spendingInput))
      );
      this.setState(state => ({
        todaySpending: Number(todaySpending) - Number(spendingInput),
        spendingInput: 0
      }));
    } catch (error) {
      console.error(error);
    }
  };

  onChangeBudget = number => {
    this.setState({ budget: number });
  };

  onResetBudget = async () => {
    try {
      await AsyncStorage.removeItem('BUDGET');
      this.setState({ budget: 0 });
    } catch (error) {
      console.error(error);
    }
  };

  onSubmitBudget = async () => {
    try {
      await AsyncStorage.setItem('BUDGET', this.state.budgetInput);
      this.setState(state => ({
        budget: state.budgetInput,
        budgetInput: 0
      }));
    } catch (error) {
      console.error(error);
    }
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
