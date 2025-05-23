import React, { useState, useEffect } from "react";
import { useWallet } from '@/hooks/useWallet';
import PageTransition from "@/components/PageTransition";
import GiftCardItem from "@/components/GiftCardItem";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Gift, UserRound, Mail, Send, Check, Coffee } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import Layout from "@/components/Layout";
import { useGiftCards, GiftCard } from "@/hooks/useGiftCards";

const giftCardDesigns = [
  {
    id: "design1",
    name: "Classic Coffee",
    preview: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: "design2",
    name: "Brewing Art",
    preview: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: "design3",
    name: "Beans & Steam",
    preview: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=400&auto=format&fit=crop",
  },
];

const denominations = [25, 50, 75, 100];

const GiftCards = () => {
  const { toast } = useToast();
  const { balance: walletBalance } = useWallet();
  const [activeTab, setActiveTab] = useState("purchase");
  const [selectedDesign, setSelectedDesign] = useState(giftCardDesigns[0]);
  const [selectedAmount, setSelectedAmount] = useState(denominations[0]);
  const [customAmount, setCustomAmount] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [message, setMessage] = useState("");
  const [redeemCode, setRedeemCode] = useState("");
  const [insufficientFunds, setInsufficientFunds] = useState(false);
  
  const { 
    giftCards,
    createGiftCard,
    isCreating,
    redeemGiftCard,
    isRedeeming,
    isLoading 
  } = useGiftCards();

  useEffect(() => {
    const amount = customAmount ? parseFloat(customAmount) : selectedAmount;
    setInsufficientFunds(amount > walletBalance);
  }, [customAmount, selectedAmount, walletBalance]);

  const handlePurchase = async () => {
    if (!recipientName || !recipientEmail) {
      toast({
        title: "Missing information",
        description: "Please fill in recipient name and email",
        variant: "destructive",
      });
      return;
    }

    const amount = customAmount ? parseFloat(customAmount) : selectedAmount;
    
    if (amount > walletBalance) {
      toast({
        title: "Insufficient funds",
        description: "Please add more funds to your wallet",
        variant: "destructive",
      });
      return;
    }

    try {
      createGiftCard({
        recipientEmail,
        amount,
        message,
        design: selectedDesign.id,
      });

      setSelectedDesign(giftCardDesigns[0]);
      setSelectedAmount(denominations[0]);
      setCustomAmount("");
      setRecipientName("");
      setRecipientEmail("");
      setMessage("");
    } catch (error: any) {
      toast({
        title: "Something went wrong",
        description: error.message || "Unable to send gift card. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleRedeem = () => {
    if (!redeemCode.trim()) {
      toast({
        title: "Missing code",
        description: "Please enter a gift card code",
        variant: "destructive",
      });
      return;
    }
    
    redeemGiftCard(redeemCode);
    setRedeemCode("");
  };

  return (
    <Layout>
      <PageTransition>
        <div className="container max-w-6xl mx-auto px-4 py-8">
          <div className="mb-16">
            <div className="flex items-center space-x-2 mb-2">
              <div className="h-6 w-6 rounded-full bg-coffee-light flex items-center justify-center">
                <Gift className="h-3 w-3 text-coffee-dark" />
              </div>
              <h1 className="text-sm font-medium text-coffee">Gift Cards</h1>
            </div>
            <h2 className="text-4xl font-display font-medium text-coffee-dark mb-4">
              Share the Coffee Experience
            </h2>
            <p className="text-muted-foreground max-w-2xl">
              Send digital gift cards to friends and family, perfect for any
              occasion. They can be used for in-store purchases or online orders.
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-16">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="purchase">Purchase</TabsTrigger>
              <TabsTrigger value="manage">My Gift Cards</TabsTrigger>
            </TabsList>

            <TabsContent value="purchase" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Gift Card Preview</CardTitle>
                      <CardDescription>
                        Choose a design and amount for your gift card
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-3">
                        <Label>Select Design</Label>
                        <div className="grid grid-cols-3 gap-3">
                          {giftCardDesigns.map((design) => (
                            <div
                              key={design.id}
                              className={cn(
                                "relative rounded-md overflow-hidden border-2 cursor-pointer transition-all",
                                selectedDesign.id === design.id
                                  ? "border-coffee"
                                  : "border-transparent hover:border-coffee/50"
                              )}
                              onClick={() => setSelectedDesign(design)}
                            >
                              <img
                                src={design.preview}
                                alt={design.name}
                                className="w-full aspect-video object-cover"
                              />
                              {selectedDesign.id === design.id && (
                                <div className="absolute top-1 right-1 h-5 w-5 bg-coffee text-white rounded-full flex items-center justify-center">
                                  <Check className="h-3 w-3" />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label>Select Amount</Label>
                        <div className="grid grid-cols-4 gap-2">
                          {denominations.map((amount) => (
                            <Button
                              key={amount}
                              type="button"
                              variant="outline"
                              className={cn(
                                selectedAmount === amount && !customAmount
                                  ? "border-coffee bg-coffee/5 text-coffee-dark"
                                  : ""
                              )}
                              onClick={() => {
                                setSelectedAmount(amount);
                                setCustomAmount("");
                              }}
                            >
                              ${amount}
                            </Button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <Label>Custom Amount</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            $
                          </span>
                          <Input
                            value={customAmount}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (
                                value === "" ||
                                (/^\d*\.?\d{0,2}$/.test(value) && parseFloat(value) <= 500)
                              ) {
                                setCustomAmount(value);
                                if (value !== "") {
                                  setSelectedAmount(0); // Deselect predefined amounts
                                }
                              }
                            }}
                            className="pl-7"
                            placeholder="Enter custom amount"
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Maximum $500
                        </p>
                      </div>

                      <div className="rounded-lg p-4 bg-cream/50 border border-cream-dark/20">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <Coffee className="h-4 w-4 text-coffee-dark" />
                            <span className="text-sm font-medium text-coffee-dark">
                              Brew Haven
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            Digital Gift Card
                          </span>
                        </div>
                        <div className="aspect-video rounded-md overflow-hidden mb-3">
                          <img
                            src={selectedDesign.preview}
                            alt={selectedDesign.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-display font-medium text-coffee-dark mb-1">
                            $
                            {customAmount
                              ? parseFloat(customAmount || "0").toFixed(2)
                              : selectedAmount.toFixed(2)}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Valid for in-store and online purchases
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Recipient Information</CardTitle>
                      <CardDescription>
                        Fill in the details of who will receive this gift card
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-3">
                        <Label htmlFor="recipientName">Recipient Name</Label>
                        <div className="relative">
                          <UserRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="recipientName"
                            value={recipientName}
                            onChange={(e) => setRecipientName(e.target.value)}
                            className="pl-10"
                            placeholder="Enter recipient's name"
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="recipientEmail">Recipient Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="recipientEmail"
                            type="email"
                            value={recipientEmail}
                            onChange={(e) => setRecipientEmail(e.target.value)}
                            className="pl-10"
                            placeholder="Enter recipient's email"
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="message">Personal Message (Optional)</Label>
                        <textarea
                          id="message"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          className="w-full min-h-24 p-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                          placeholder="Add a personal message to your gift card..."
                        />
                      </div>

                      <Separator />

                      <div>
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-sm text-muted-foreground">
                            Wallet Balance
                          </span>
                          <span className={`font-medium ${insufficientFunds ? 'text-red-500' : ''}`}>
                            ${walletBalance.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-sm text-muted-foreground">
                            Gift Card Amount
                          </span>
                          <span className="font-medium">
                            $
                            {customAmount
                              ? parseFloat(customAmount || "0").toFixed(2)
                              : selectedAmount.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-sm text-muted-foreground">
                            Service Fee
                          </span>
                          <span className="font-medium">$0.00</span>
                        </div>
                        <Separator className="my-3" />
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Total</span>
                          <span className="font-display font-medium text-lg text-coffee-dark">
                            $
                            {customAmount
                              ? parseFloat(customAmount || "0").toFixed(2)
                              : selectedAmount.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        onClick={handlePurchase}
                        disabled={
                          isCreating ||
                          (!selectedAmount && !customAmount) ||
                          !recipientName ||
                          !recipientEmail ||
                          insufficientFunds
                        }
                        className="w-full bg-coffee hover:bg-coffee-dark text-white"
                      >
                        {isCreating ? (
                          <span className="animate-pulse-soft">Sending...</span>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" /> Send Gift Card
                          </>
                        )}
                      </Button>
                      {insufficientFunds && (
                        <div className="w-full mt-2 text-xs text-red-500 text-center">
                          Insufficient funds in your wallet. Current balance: ${walletBalance.toFixed(2)}
                        </div>
                      )}
                    </CardFooter>
                  </Card>
                </motion.div>
              </div>
            </TabsContent>

            <TabsContent value="manage" className="mt-6">
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-coffee"></div>
                </div>
              ) : giftCards.length === 0 ? (
                <div className="text-center py-12 bg-cream/50 rounded-lg border border-cream-dark/20">
                  <Gift className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-display font-medium text-coffee-dark mb-2">
                    No Gift Cards Yet
                  </h3>
                  <p className="text-muted-foreground max-w-md mx-auto mb-6">
                    You don't have any gift cards in your wallet yet. Purchase a
                    gift card or redeem one to get started.
                  </p>
                  <Button
                    onClick={() => setActiveTab("purchase")}
                    className="bg-coffee hover:bg-coffee-dark text-white"
                  >
                    Purchase a Gift Card
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {giftCards.map((card: GiftCard) => (
                      <GiftCardItem
                        key={card.id}
                        id={card.id}
                        code={card.code}
                        amount={card.amount}
                        balance={card.balance}
                        createdAt={new Date(card.createdAt)}
                        expiresAt={new Date(card.expiresAt)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>

          <div className="bg-cream rounded-xl overflow-hidden shadow-sm border border-cream-dark/30">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-8 md:p-12 space-y-6">
                <div>
                  <h3 className="text-2xl font-display font-medium text-coffee-dark mb-3">
                    Redeem a Gift Card
                  </h3>
                  <p className="text-muted-foreground">
                    Have a gift card code? Enter it below to add it to your wallet.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="giftCardCode">Gift Card Code</Label>
                    <Input
                      id="giftCardCode"
                      placeholder="Enter your gift card code"
                      value={redeemCode}
                      onChange={(e) => setRedeemCode(e.target.value)}
                    />
                  </div>
                  <Button 
                    className="w-full bg-coffee hover:bg-coffee-dark text-white"
                    onClick={handleRedeem}
                    disabled={isRedeeming || !redeemCode.trim()}
                  >
                    {isRedeeming ? (
                      <span className="animate-pulse-soft">Redeeming...</span>
                    ) : (
                      "Redeem Card"
                    )}
                  </Button>
                </div>
              </div>
              <div className="bg-coffee-light h-full hidden md:block">
                <div className="relative h-full">
                  <img
                    src="https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=737&auto=format&fit=crop"
                    alt="Gift card"
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/90 backdrop-blur-xs rounded-lg p-6 text-center max-w-xs">
                      <Gift className="h-8 w-8 text-coffee mx-auto mb-3" />
                      <h4 className="font-display font-medium text-coffee-dark text-lg mb-2">
                        The Perfect Gift
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Our digital gift cards work seamlessly for both in-store
                        and online purchases.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageTransition>
    </Layout>
  );
};

export default GiftCards;
