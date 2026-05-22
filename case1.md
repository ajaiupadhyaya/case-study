Case 1

In the Applied Financial Math for Decision-Making project, you’re a senior investment advisor at Dynamic Wealth Management (DWM)—a prestigious firm that oversees over $2 billion in assets for high-net-worth individuals and institutions. With its headquarters in the financial hub of New York City, DWM has earned a reputation for its personalized approach and innovative investment solutions.

You manage a significant client portfolio, utilizing your financial knowledge to develop personalized financial plans and making pivotal investment recommendations that align with each client's unique objectives.

As a senior investment advisor at Dynamic Wealth Management (DWM), your role involves managing diverse portfolios and advising high-net-worth clients. The firm—headquartered in the financial hub of New York City—is renowned for its tailored financial strategies backed by sophisticated mathematical models. One of your clients, Mr. Thompson, has recently received a substantial inheritance and is considering investing it into one of the following three annuity plans.

1.The first plan is an ordinary annuity that guarantees a fixed payment of \$30,000 annually for the next 25 years.

2.The second plan is a delayed annuity that promises to pay \$50,000 annually, but payments will only start from the end of the 11th year and continue for 15 years.

3.The third plan is a growing perpetuity that guarantees an initial payment of \$15,000 at the end of the first year, with subsequent annual payments increasing by 2% each year.

Tip 1: Use Excel’s Case 1 sheet to perform your calculations.

Tip 2: Assume that the annual interest rate equals 6%.

 

Your goal is to value these annuity plans. Which of the three options should you advise Mr. Thompson to take?

 

To compare the three investment opportunities, find their present value.

1. For the first investment plan, we're dealing with an ordinary annuity that offers $30,000 annually for the next 25 years. We must find its present value (PV) to compare it with other investment options. The PV of an ordinary annuity can be calculated using the following formula:

\[PV=A\left[\frac{1-\frac{1}{\left(1+r\right)^N}}{r}\right]\]

Where A represents the annuity payments, r represents the interest rate, and N represents the number of periods. This formula calculates the total value of the annuity payments in today's terms.

As an alternative method, we can use Excel’s PV function, which calculates the present value of a loan or an investment, given a constant interest rate.

2. For the second calculation, we need to find the present value of the annuity at Year 10 and then discount it to obtain its present value at Year 0. The formula to find the future value (PV) of an ordinary annuity is as follows:

\[{FV}_N=A\left[\frac{\left(1+r\right)^N-1}{r}\right]\]

Alternatively, we can get the same result using Excel’s PV function. The last step is discounting the result for 10 more periods to obtain the present value.

3. For the last scenario, we’re dealing with perpetuity (an infinite series of payments). To find the present value of a growing perpetuity, we use the following formula:

C represents the first cash flow amount; r is the interest rate, and g is the growth rate. This formula calculates the present value of future payments that grow constantly, extending indefinitely into the future.

\[{PV}_{growing\ perpetuity}=\frac{C}{r-g}\]




