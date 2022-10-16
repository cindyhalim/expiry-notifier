import { ItemStatus, type NotionItem } from "@utils";
import { controller as onGetStatus } from "../onGetStatus";

describe("onGetStatus", () => {
  const createMockNotionItem = (
    customData?: Partial<NotionItem>
  ): NotionItem => ({
    id: "1234",
    title: "credit card",
    expiryDate: "2023-04-05",
    notifyBeforeInMonths: 1,
    status: null,
    ...customData,
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it.each(["title", "expiryDate"])(
    "returns missing properties status if missing %s",
    async (property) => {
      const mockNotionItem = createMockNotionItem({ [property]: null });

      const response = await onGetStatus(mockNotionItem);

      expect(response.status).toBe(ItemStatus.MISSING_PROPERTIES);
    }
  );

  it("returns expired status if expiry date passed current date", async () => {
    jest.useFakeTimers().setSystemTime(new Date("2023-04-06"));

    const mockNotionItem = createMockNotionItem();
    const response = await onGetStatus(mockNotionItem);

    expect(response.status).toBe(ItemStatus.EXPIRED);
  });

  it("returns expiring soon status if expiry date is within notify before and status is not notified", async () => {
    jest.useFakeTimers().setSystemTime(new Date("2023-03-04"));
    const mockNotionItem = createMockNotionItem({
      status: ItemStatus.GOOD,
    });
    const response = await onGetStatus(mockNotionItem);

    expect(response.status).toBe(ItemStatus.EXPIRING_SOON);
  });

  it("returns notified status if expiry date is within notify before and status is notified", async () => {
    jest.useFakeTimers().setSystemTime(new Date("2023-03-04"));
    const mockNotionItem = createMockNotionItem({
      status: ItemStatus.NOTIFIED,
    });
    const response = await onGetStatus(mockNotionItem);

    expect(response.status).toBe(ItemStatus.NOTIFIED);
  });

  it("returns good status if expiry date is not within notify before", async () => {
    jest.useFakeTimers().setSystemTime(new Date("2023-02-04"));
    const mockNotionItem = createMockNotionItem({
      status: null,
    });
    const response = await onGetStatus(mockNotionItem);

    expect(response.status).toBe(ItemStatus.GOOD);
  });
});
