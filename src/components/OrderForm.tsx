/* eslint-disable @typescript-eslint/no-explicit-any */
import * as z from "zod";
import { useForm } from "react-hook-form";
import { Toaster, toast } from "react-hot-toast";

// State Management
import { useSnapshot } from "valtio";
import { state } from "@/state";
import { customAlphabet } from "nanoid";

// UI IMPORTS
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// ***** proposed update to form schema
const formSchema: any = z.object({
  id: z.string(),
  isExpired: z.boolean(),
  customerInfo: z.object({
    customerName: z.string().min(1, "Required"),
    phone: z.string().min(1, "Required"),
  }),
  orderInfo: z
    .object({
      breakfast: z.object({
        item: z.string(),
        price: z.number(),
        quantity: z.number(),
      }),
      mainMenu: z.object({
        item: z.string(),
        price: z.number(),
        quantity: z.number(),
      }),
      protein: z.object({
        item: z.string(),
        price: z.number(),
        quantity: z.number(),
      }),
      drinks: z.object({
        item: z.string(),
        price: z.number(),
        quantity: z.number(),
      }),
      additionalItems: z.object({
        item: z.string(),
        price: z.number(),
        quantity: z.number(),
      }),
      waitTime: z.coerce.number().gte(1, "Must be greater than 0"),
    })
    .partial()
    .refine(
      ({ breakfast, mainMenu, protein, drinks, additionalItems }) => {
        if (
          (!breakfast?.item || breakfast.item === "") &&
          (!mainMenu?.item || mainMenu.item === "") &&
          (!protein?.item || protein.item === "") &&
          (!drinks?.item || drinks.item === "") &&
          (!additionalItems?.item || additionalItems.item === "")
        ) {
          toast.error("One of the place order fields must be filled", {
            duration: 4000,
            position: "top-right",
          });
          return false;
        }
        return true;
      },
      {
        message: "One of the fields must be defined",
      }
    ),
});

const breakfastMenu = [
  { label: "Boiled yam", value: "en", price: 400 },
  { label: "Pap", value: "en", price: 400 },
  { label: "Custard", value: "en", price: 400 },
  { label: "Akara", value: "en", price: 600 },
  { label: "Fish sauce", value: "en", price: 1100 },
  { label: "Egg sauce", value: "en", price: 1000 },
  { label: "Boiled plantain", value: "en", price: 400 },
];
const mainMenu = [
  { label: "Village rice", value: "en", price: 1600 },
  { label: "Rich palm oil", value: "en", price: 2200 },
  { label: "Special fried rice", value: "en", price: 2000 },
  { label: "Jambalaya rice", value: "en", price: 2200 },
  { label: "Coconut rice", value: "en", price: 1100 },
  { label: "Jollof rice", value: "en", price: 1000 },
  { label: "Fried rice", value: "en", price: 1000 },
  { label: "Rice and Beans", value: "en", price: 800 },
  { label: "Ewariro", value: "en", price: 900 },
  { label: "Plain beans", value: "en", price: 900 },
  { label: "Yam porridge", value: "en", price: 1200 },
  { label: "Spaghetti", value: "en", price: 1000 },
  { label: "White rice", value: "en", price: 800 },
];
const protein = [
  { label: "Cowleg", value: "en", price: 2200 },
  { label: "Cowtail", value: "en", price: 2200 },
  { label: "Goat meat", value: "en", price: 2000 },
  { label: "Assorted", value: "en", price: 900 },
  { label: "Beef", value: "en", price: 900 },
  { label: "Ponmo", value: "en", price: 500 },
  { label: "Fried turkey", value: "en", price: 2100 },
  { label: "Grilled chicken", value: "en", price: 2500 },
  { label: "Small turkey", value: "en", price: 2500 },
  { label: "Asun", value: "en", price: 2000 },
  { label: "Panla", value: "en", price: 2100 },
  { label: "Titus", value: "en", price: 1700 },
  { label: "Cat fish", value: "en", price: 2700 },
  { label: "Croaker", value: "en", price: 2200 },
];
const additionalItems = [
  { label: "Coleslaw", value: "en", price: 400 },
  { label: "Plantain", value: "en", price: 600 },
  { label: "Moi Moi", value: "en", price: 800 },
];
const drinks = [
  { label: "Pepsi", value: "en", price: 500 },
  { label: "Coca-cola", value: "en", price: 500 },
  { label: "utterly yum", value: "en", price: 2400 },
  { label: "Fura", value: "en", price: 3200 },
  { label: "tiger nut ", value: "en", price: 2800 },
  { label: "boomsky", value: "en", price: 2850 },
  { label: "Lucozade boost", value: "en", price: 1000 },
  { label: "Ribena", value: "en", price: 900 },
  { label: "Malt", value: "en", price: 600 },
  { label: "Water", value: "en", price: 350 },
];

const OrderForm = () => {
  const snap = useSnapshot(state);
  const [subtotal, setSubtotal] = useState(0);
  const navigate = useNavigate();
  const nanoid = customAlphabet("1234567890abcdef", 10);
  // 1. Define your form.

  //  ** Proposed form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: `#${nanoid(7)}`,
      isExpired: false,
      customerInfo: {
        customerName: "",
        phone: "",
      },
      orderInfo: {
        breakfast: {
          item: "",
          price: 0,
          quantity: 0,
        },
        mainMenu: {
          item: "",
          price: 0,
          quantity: 0,
        },
        protein: {
          item: "",
          price: 0,
          quantity: 0,
        },
        drinks: {
          item: "",
          price: 0,
          quantity: 0,
        },
        additionalItems: {
          item: "",
          price: 0,
          quantity: 0,
        },
        waitTime: 0,
      },
    },
  });

  const { watch, reset } = form;
  useEffect(() => {
    if (snap.submitted) {
      reset();
      navigate(0);
    }
    watch((values) => {
      const totalFoodPrice = [
        values.orderInfo?.breakfast?.price,
        values.orderInfo?.mainMenu?.price,
        values.orderInfo?.protein?.price,
        values.orderInfo?.additionalItems?.price,
        values.orderInfo?.drinks?.price,
      ];
      if (!totalFoodPrice.includes(undefined)) {
        const calculatedTotal =
          values.orderInfo!.breakfast!.price! +
          values.orderInfo!.mainMenu!.price! +
          values.orderInfo!.protein!.price! +
          values.orderInfo!.additionalItems!.price! +
          values.orderInfo!.drinks!.price!;
        setSubtotal(calculatedTotal);
      }
    });
    // form.setValue("total", calculatedTotal);
    // return subscription.unsubscribe();
  }, [reset, watch, snap.submitted, subtotal, navigate]);

  // const watchedValues = watch();

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // form.setValue("total", subtotal);
    state.formStep = 1;
    if (values) {
      state.showPreview = true;
      state.order = values;

      state.summary.map((data, index) => {
        if (index === 0) {
          data.description = values.id;
        }
        if (index === 1) {
          data.description = values.customerInfo.customerName;
        }

        if (index === 2) {
          data.description = values.orderInfo.waitTime + "mins";
        }

        if (index === 3) {
          data.description = subtotal;
        }
        if (index === 4) {
          data.description = subtotal;
        }
      });
    }
  };
  return (
    <div className={`bg-white p-8 ${snap.formStep === 0 ? "block" : "hidden"}`}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="">
          <p className="text-2xl font-semibold">Customer Details</p>
          <div className="block lg:flex justify-between items-center w-full py-6">
            <FormField
              control={form.control}
              name="customerInfo.customerName"
              render={({ field }) => (
                <FormItem className="w-full lg:w-1/2 lg:mr-3">
                  <FormLabel>Customer Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Customer name" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="customerInfo.phone"
              render={({ field }) => (
                <FormItem className="w-full lg:w-1/2 lg:ml-3 mt-3 lg:mt-0">
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter phone number" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <p className="text-2xl font-semibold pb-6">Place Order</p>
          <div className="block lg:flex justify-between items-center w-full pb-3">
            <FormField
              control={form.control}
              name="orderInfo.breakfast.item"
              render={({ field }) => (
                <FormItem className="w-full lg:w-1/2 lg:mr-3">
                  <FormLabel>Breakfast</FormLabel>

                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full px-3 py-4 h-full justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? field.value : "Select breakfast"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Command>
                        <CommandInput placeholder="Search breakfast menu..." />
                        <CommandEmpty>No item found.</CommandEmpty>
                        <CommandGroup>
                          {breakfastMenu.map((language) => (
                            <CommandItem
                              value={language.label}
                              key={language.value}
                              onSelect={() => {
                                form.setValue(
                                  `orderInfo.breakfast.item`,
                                  language.label
                                );
                                form.setValue(
                                  "orderInfo.breakfast.price",
                                  language.price
                                );
                                form.setValue(
                                  "orderInfo.breakfast.quantity",
                                  1
                                );
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  language.label === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              <div className="flex justify-between items-center w-full">
                                <p>{language.label}</p>
                                <p>₦ {language.price}</p>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="orderInfo.mainMenu.item"
              render={({ field }) => (
                <FormItem className="w-full lg:w-1/2 lg:ml-3 mt-3 lg:mt-0">
                  <FormLabel>Main menu</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full px-3 py-4 h-full justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? field.value : "Select main menu"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Command>
                        <CommandInput placeholder="Search main menu..." />
                        <CommandEmpty>No item found.</CommandEmpty>
                        <CommandGroup>
                          {mainMenu.map((language) => (
                            <CommandItem
                              value={language.label}
                              key={language.value}
                              onSelect={() => {
                                form.setValue(
                                  "orderInfo.mainMenu.item",
                                  language.label
                                );
                                form.setValue(
                                  "orderInfo.mainMenu.price",
                                  language.price
                                );
                                form.setValue("orderInfo.mainMenu.quantity", 1);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  language.label === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              <div className="flex justify-between items-center w-full">
                                <p>{language.label}</p>
                                <p>₦ {language.price}</p>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="block lg:flex justify-between items-center w-full pb-3">
            <FormField
              control={form.control}
              name="orderInfo.protein.item"
              render={({ field }) => (
                <FormItem className="w-full lg:w-1/2 lg:mr-3">
                  <FormLabel>Protein</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full px-3 py-4 h-full justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? field.value : "Select protein"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Command>
                        <CommandInput placeholder="Search protein..." />
                        <CommandEmpty>No item found.</CommandEmpty>
                        <CommandGroup>
                          {protein.map((language) => (
                            <CommandItem
                              value={language.label}
                              key={language.value}
                              onSelect={() => {
                                form.setValue(
                                  "orderInfo.protein.item",
                                  language.label
                                );
                                form.setValue(
                                  "orderInfo.protein.price",
                                  language.price
                                );
                                form.setValue("orderInfo.protein.quantity", 1);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  language.label === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              <div className="flex justify-between items-center w-full">
                                <p>{language.label}</p>
                                <p>₦ {language.price}</p>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="orderInfo.drinks.item"
              render={({ field }) => (
                <FormItem className="w-full lg:w-1/2 lg:ml-3 mt-3 lg:mt-0">
                  <FormLabel>Drinks</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full px-3 py-4 h-full justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? field.value : "Select drinks"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Command>
                        <CommandInput placeholder="Search Drinks..." />
                        <CommandEmpty>No item found.</CommandEmpty>
                        <CommandGroup>
                          {drinks.map((language) => (
                            <CommandItem
                              value={language.label}
                              key={language.value}
                              onSelect={() => {
                                form.setValue(
                                  "orderInfo.drinks.item",
                                  language.label
                                );
                                form.setValue(
                                  "orderInfo.drinks.price",
                                  language.price
                                );
                                form.setValue("orderInfo.drinks.quantity", 1);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  language.label === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              <div className="flex justify-between items-center w-full">
                                <p>{language.label}</p>
                                <p>₦ {language.price}</p>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="block lg:flex justify-between items-center w-full pb-3">
            <FormField
              control={form.control}
              name="orderInfo.additionalItems.item"
              render={({ field }) => (
                <FormItem className="w-full lg:w-1/2 lg:mr-3">
                  <FormLabel>Additonal Items</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full px-3 py-4 h-full justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? field.value : "Select Additonal Items"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Command>
                        <CommandInput placeholder="Search Additonal Items..." />
                        <CommandEmpty>No item found.</CommandEmpty>
                        <CommandGroup>
                          {additionalItems.map((language) => (
                            <CommandItem
                              value={language.label}
                              key={language.value}
                              onSelect={() => {
                                form.setValue(
                                  "orderInfo.additionalItems.item",
                                  language.label
                                );
                                form.setValue(
                                  "orderInfo.additionalItems.price",
                                  language.price
                                );
                                form.setValue(
                                  "orderInfo.additionalItems.quantity",
                                  1
                                );
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  language.label === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              <div className="flex justify-between items-center w-full">
                                <p>{language.label}</p>
                                <p>₦ {language.price}</p>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="orderInfo.waitTime"
              render={({ field }) => (
                <FormItem className="w-full lg:w-1/2 lg:ml-3 mt-3 lg:mt-0">
                  <FormLabel>Estimated time (min)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="enter estimated time"
                      type="number"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            className="w-full mt-3 lg:mt-4 py-6 lg:mx-auto text-base lg:text-lg bg-orange-400"
            type="submit"
          >
            Submit
          </Button>
        </form>
      </Form>
      <Toaster />
    </div>
  );
};

export default OrderForm;
