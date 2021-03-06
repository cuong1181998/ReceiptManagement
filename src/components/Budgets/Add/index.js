/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-native/no-unused-styles */
/* eslint-disable react-native/no-color-literals */
/* eslint-disable react-native/no-raw-text */
import React from 'react';
import {
  View, Left, Right, Text, Header, Body, List, ListItem, Input, Thumbnail, Picker, Icon
} from 'native-base';
import { StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native';
import DateRangePicker from 'react-native-daterange-picker';
import moment from 'moment';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon1 from '../../../../assets/images/logo.png';
import AlertCustom from '../../Common/Alert';

export default function DetailBudget(props) {
  const navigation = useNavigation();
  const route = useRoute();

  const id = route.params?.id;
  const isAdd = !route.params?.id;
  const {
    categories = [], budgets = [], onAdd, onDelete, onUpdate
  } = props;

  const [displayedDate, setDisplayedDate] = React.useState(moment());
  const getCategoryId = React.useCallback(
    (name) => categories.find((o) => o.name === name)?.id,
    [categories]
  );

  const getCategoryById = React.useCallback(
    (id_) => categories.find((o) => o.id === id_),
    [categories]
  );

  const budget = budgets.find((o) => o.id === id)
  || {
    fromDate: moment().startOf('month'),
    toDate: moment().endOf('month')
  };
  const [detail, setDetail] = React.useState({
    id: budget.id,
    category_id: getCategoryId(budget.category),
    fromDate: moment(budget.fromDate),
    toDate: moment(budget.toDate),
    among: `${budget.among || 0}`
  });
  const backToList = React.useCallback(() => {
    navigation.navigate('List');
  }, [navigation]);

  const saved = React.useCallback((type) => {
    AlertCustom({
      message: 'Are you sure ?',
      title: 'Confirm Save',
      onOk: () => {
        if (type === 'add') {
          onAdd(detail);
        }
        if (type === 'update') {
          onUpdate(detail);
        }
        if (type === 'delete') {
          onDelete(detail.id);
        }
        backToList();
      }
    });
  }, [onAdd, detail, backToList, onUpdate, onDelete]);

  const updateField = React.useCallback((key, value) => {
    setDetail((old) => ({ ...old, [key]: value }));
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Header style={styles.header}>
          <Left><Icon type="MaterialIcons" name="arrow-back" onPress={backToList} /></Left>
          <Body><Text>{isAdd ? 'Add Budget' : 'Detail'}</Text></Body>
          <Right>
            { isAdd ? <Icon type="MaterialIcons" name="done" onPress={() => saved('add')} /> : (
              <>
                <Icon type="MaterialIcons" name="create" onPress={() => saved('update')} />
                <Icon type="MaterialIcons" name="delete" onPress={() => saved('delete')} />
              </>
            )}
          </Right>
        </Header>
        <List>
          <ListItem>
            <Left>
              <Thumbnail small source={Icon1} />
              <Text>Category</Text>
            </Left>
            <Right style={styles.right}>
              <Picker
                mode="dropdown"
                iosIcon={<Icon name="arrow-down" />}
                placeholder="Select category"
                placeholderIconColor="#007aff"
                selectedValue={detail.category_id}
                onValueChange={(value) => updateField('category_id', value)}
              >
                {categories.map((o) => {
                  const category = getCategoryById(o.id);
                  return (
                    <Picker.Item
                      key={o.id}
                      label={(
                        <View style={{ flexDirection: 'row', alignContent: 'center', alignItems: 'center' }}>
                          <Icon name={category.icon} />
                          <Text style={{ paddingLeft: 10 }}>{category.name}</Text>
                        </View>
                  )}
                      value={o.id}
                    />
                  );
                })}
              </Picker>
            </Right>
          </ListItem>
          <ListItem style={styles.amongRow}>
            <Left>
              <Text>Among</Text>
            </Left>
            <Right style={styles.amongInput}>
              <Text>$</Text>
              <Input
                style={styles.input}
                value={detail.among}
                keyboardType="numeric"
                onChangeText={(value) => updateField('among', value)}
              />
            </Right>
          </ListItem>
          <ListItem>
            <Left style={styles.dateLabel}>
              <Text>Time Range</Text>
            </Left>
            <Right>
              <DateRangePicker
                onChange={(dates) => {
                  console.log(dates);
                  if (dates.startDate) {
                    updateField('fromDate', dates.startDate);
                  }
                  if (dates.endDate) {
                    updateField('toDate', dates.endDate);
                  }
                  if (dates.displayedDate) {
                    setDisplayedDate(dates.displayedDate);
                  }
                }}
                endDate={detail.toDate}
                startDate={detail.fromDate}
                displayedDate={displayedDate}
                range
                containerStyle={styles.containerStyle}
              >
                <Text>
                  {`${moment(detail.fromDate).format('DD/MM/YYYY')} - ${moment(detail.toDate).format('DD/MM/YYYY')}`}
                </Text>
              </DateRangePicker>
            </Right>
          </ListItem>
        </List>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    minHeight: '100%'
  },
  header: {

  },
  right: {
    flex: 1,
  },
  containerStyle: {
    top: '-40%',
    width: 300,
  },
  dateLabel: {
    flex: 0.7,
  },
  input: {
    borderWidth: 1,
    borderColor: 'black',
    marginLeft: 10,
    height: 40,
    borderRadius: 5,
  },
  amongRow: {
    height: 60
  },
  amongInput: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  }
});
