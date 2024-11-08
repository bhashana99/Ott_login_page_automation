/// <reference types="cypress" />

import HomePagePOM from "../PageObjects/HomePagePOM.js";
import OrderPagePOM from "../PageObjects/OrderPagePOM.js";
import CreateNewOrderPagePOM from "../PageObjects/CreateNewOrderPagePOM.js";

let user, urls, orderData;

before(() => {
  cy.fixture("../fixtures/JsonData/userInfo.json").then((userInfo) => {
    user = userInfo;
  });
  cy.fixture("../fixtures/JsonData/pagesUrl.json").then((pageUrls) => {
    urls = pageUrls;
  });
  cy.fixture("../fixtures/JsonData/newOrder.json").then((data) => {
    orderData = data;
  });
});

const home = new HomePagePOM();
const order = new OrderPagePOM();
const newOrder = new CreateNewOrderPagePOM();

const validateDateGap = () => {
  const startDateTime = new Date(
    `${orderData.startYear}-${String(orderData.startMonth).padStart(
      2,
      "0"
    )}-${String(orderData.startDay).padStart(2, "0")}T${String(
      orderData.startHours
    ).padStart(2, "0")}:${String(orderData.startMinutes).padStart(2, "0")}:00`
  );

  const endDateTime = new Date(
    `${orderData.endYear}-${String(orderData.endMonth).padStart(
      2,
      "0"
    )}-${String(orderData.endDay).padStart(2, "0")}T${String(
      orderData.endHours
    ).padStart(2, "0")}:${String(orderData.endMinutes).padStart(2, "0")}:00`
  );

  const differenceInMilliseconds = endDateTime - startDateTime;
  const differenceInHours = differenceInMilliseconds / (1000 * 60 * 60);

  expect(differenceInHours).to.be.gte(
    6,
    "End date must be at least 6 hours after start date"
  );
};

//login
beforeEach(() => {
  cy.loginToHomePage(
    urls.loginPageUrl,
    user.username,
    user.password,
    urls.homePageUrl
  );
});

describe("Create New Order", () => {
  it("Navigate create new order page", () => {
    home.clickDeliveryDropDown();
    order.clickDeliveryDropDownOrderElement();
    order.checkPageUrl(urls.orderPageUrl);
    order.clickNewOrderBtn();
    newOrder.checkCreateNewOrderPageUrl(urls.createNewOrderPageUrl);
    newOrder.setOrderName(orderData.orderName);
    newOrder.setTrafficker(orderData.traffickerName);
    newOrder.setProduct(orderData.product);
    newOrder.clickSalesPersonDropDown();
    newOrder.chooseSalesPersonDropDownPersonOneOption();
    newOrder.selectSalesTypeRadioFirstLabel();
    newOrder.setScheduleReference(orderData.scheduleReference);
    newOrder.selectInvoiceTypeZero();
    newOrder.selectClientType();
    newOrder.clickEndClientField();
    newOrder.chooseEndClientNadun();
    newOrder.clickBillingClientField();
    newOrder.chooseBillingClientTestClientOne();
    newOrder.clickAgencyFiled();
    newOrder.chooseAgencyFiledFirstOption();
    newOrder.clickMonthField();
    newOrder.selectMonth(5);
    newOrder.setBudget(orderData.budget);
    newOrder.setImpression(orderData.impression);
    newOrder.setStartMonth(orderData.startMonth);
    newOrder.setStartDay(orderData.startDay);
    newOrder.setStartYear(orderData.startYear);
    newOrder.clickOutside();
    newOrder.setStartHours(orderData.startHours);
    newOrder.setStartMinutes(orderData.startMinutes);
    newOrder.clickOutside();
    newOrder.setEndMonth(orderData.endMonth);
    newOrder.setEndDay(orderData.endDay);
    newOrder.setEndYear(orderData.endYear);
    newOrder.clickOutside();
    newOrder.setEndHours(orderData.endHours);
    newOrder.setEndMinutes(orderData.endMinutes);
    newOrder.clickOutside();

    validateDateGap();

    newOrder.checkTableNumberOfRows(orderData.tableRows);
    newOrder.addFirstColumnToTable();
    newOrder.addThirdColumnToTable();
    newOrder.addFirstColumnToTable();
    newOrder.removeThirdColumnInTable();
    newOrder.removeFirstColumnInTable();

    newOrder.clickSubmitBtn();
    newOrder.validateOrderIsCreateSuccessful();
    newOrder.clickCloseBtn();
  });
});
