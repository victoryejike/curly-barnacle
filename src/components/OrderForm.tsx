/* eslint-disable @typescript-eslint/no-explicit-any */
import * as z from "zod";
import { useForm } from "react-hook-form";

// State Management
import { useSnapshot } from "valtio";
import { state } from "@/state";

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

const formSchema = z.object({
  customerName: z.string().min(1, "Required"),
  phone: z.string().min(1, "Required"),
  breakfast: z.object({ item: z.string(), price: z.number() }),
  mainMenu: z.object({ item: z.string(), price: z.number() }),
  protein: z.object({ item: z.string(), price: z.number() }),
  drinks: z.object({ item: z.string(), price: z.number() }),
  additionalItems: z.object({ item: z.string(), price: z.number() }),
  waitTime: z.coerce.number().gte(1, "Must be greater than 0"),
  total: z.coerce.number(),
});

const languages = [
  { label: "English", value: "en", price: 1200 },
  { label: "French", value: "fr", price: 1200 },
  { label: "German", value: "de", price: 1200 },
  { label: "Spanish", value: "es", price: 1200 },
  { label: "Portuguese", value: "pt", price: 1200 },
  { label: "Russian", value: "ru", price: 1200 },
  { label: "Japanese", value: "ja", price: 1200 },
  { label: "Korean", value: "ko", price: 1200 },
  { label: "Chinese", value: "zh", price: 1200 },
] as const;

const OrderForm = () => {
  const snap = useSnapshot(state);
  const [subtotal, setSubtotal] = useState(0);
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: "",
      phone: "",
      breakfast: {
        item: "",
        price: 0,
      },
      mainMenu: {
        item: "",
        price: 0,
      },
      protein: {
        item: "",
        price: 0,
      },
      drinks: {
        item: "",
        price: 0,
      },
      additionalItems: {
        item: "",
        price: 0,
      },
      waitTime: 0,
      total: subtotal,
    },
  });

  useEffect(() => {
    if (snap.submitted) form.reset();
    form.watch((values) => {
      const totalFoodPrice = [
        values.breakfast?.price,
        values.mainMenu?.price,
        values.protein?.price,
        values.additionalItems?.price,
        values.drinks?.price,
      ];
      if (!totalFoodPrice.includes(undefined)) {
        const calculatedTotal =
          values.breakfast!.price! +
          values.mainMenu!.price! +
          values.protein!.price! +
          values.additionalItems!.price! +
          values.drinks!.price!;
        setSubtotal(calculatedTotal);
      }
    });
    // form.setValue("total", calculatedTotal);
    // return subscription.unsubscribe();
  }, [form, form.watch, snap.submitted]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // form.setValue("total", subtotal);
    console.log(values, subtotal);
    if (values) {
      state.showPreview = true;
      state.order = values;
      state.summary.map((data, index) => {
        if (index === 1) {
          data.description = values.customerName;
        }

        if (index === 2) {
          data.description = values.waitTime + "mins";
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
    <div className={`bg-white p-8 ${snap.showPreview ? "hidden" : "block"}`}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="">
          <p className="text-2xl font-semibold">Customer Details</p>
          <div className="flex justify-between items-center w-full py-6">
            <FormField
              control={form.control}
              name="customerName"
              render={({ field }) => (
                <FormItem className="w-1/2 mr-3">
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
              name="phone"
              render={({ field }) => (
                <FormItem className="w-1/2 ml-3">
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
          <div className="flex justify-between items-center w-full pb-3">
            <FormField
              control={form.control}
              name="breakfast.item"
              render={({ field }) => (
                <FormItem className="w-1/2 mr-3">
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
                          {languages.map((language) => (
                            <CommandItem
                              value={language.label}
                              key={language.value}
                              onSelect={() => {
                                form.setValue(`breakfast.item`, language.label);
                                form.setValue(
                                  "breakfast.price",
                                  language.price
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
              name="mainMenu.item"
              render={({ field }) => (
                <FormItem className="w-1/2 ml-3">
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
                          {languages.map((language) => (
                            <CommandItem
                              value={language.label}
                              key={language.value}
                              onSelect={() => {
                                form.setValue("mainMenu.item", language.label);
                                form.setValue("mainMenu.price", language.price);
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
          <div className="flex justify-between items-center w-full pb-3">
            <FormField
              control={form.control}
              name="protein.item"
              render={({ field }) => (
                <FormItem className="w-1/2 mr-3">
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
                          {languages.map((language) => (
                            <CommandItem
                              value={language.label}
                              key={language.value}
                              onSelect={() => {
                                form.setValue("protein.item", language.label);
                                form.setValue("protein.price", language.price);
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
              name="drinks.item"
              render={({ field }) => (
                <FormItem className="w-1/2 ml-3">
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
                          {languages.map((language) => (
                            <CommandItem
                              value={language.label}
                              key={language.value}
                              onSelect={() => {
                                form.setValue("drinks.item", language.label);
                                form.setValue("drinks.price", language.price);
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
          <div className="flex justify-between items-center w-full pb-3">
            <FormField
              control={form.control}
              name="additionalItems.item"
              render={({ field }) => (
                <FormItem className="w-1/2 mr-3">
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
                          {languages.map((language) => (
                            <CommandItem
                              value={language.label}
                              key={language.value}
                              onSelect={() => {
                                form.setValue(
                                  "additionalItems.item",
                                  language.label
                                );
                                form.setValue(
                                  "additionalItems.price",
                                  language.price
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
              name="waitTime"
              render={({ field }) => (
                <FormItem className="w-1/2 ml-3">
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
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
};

export default OrderForm;
