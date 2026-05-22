Case 2

Emma and David Brooks are preparing for retirement and have identified several mutual funds they are considering investing in. The most attractive one includes the OceanBlue Fund.

Your task is to examine the past performance of OceanBlue. You are to calculate its money-weighted rate of return and time-weighted rate of return.

Consider the fund's historical returns, investment inflows, outflows, and overall market performance in your analysis. This will help Emma and David better understand the potential growth of their investment and aid in their financial decision-making process.

Once you’ve completed your analysis, present your findings. What is the money- and time-weighted rate of return for OceanBlue? Which of the two returns is higher?

Tip 1: Use Excel’s Case 2 sheet to perform your calculations.

Tip 2: Assume that the fund receives investments at the beginning of each year. 

 

To obtain the money-weighted rate of return, take the following steps:

1.Identify the cash flows: The first step involves identifying the cash flows in each investment year. Cash flows include the initial investment, any additional capital invested, profits realized from the return on investment, and any funds withdrawn by investors.

2.Calculate the return on investment (ROI): For each year, calculate the return on investment—typically expressed as a percentage of the initial investment. This is calculated by multiplying the assets under management (AUM) by the given return rate.

3.Determine the ending portfolio value: After determining the ROI, the next step is calculating the ending portfolio value by adding the return to the AUM or subtracting it in case of a loss.

4.Determine the net cash flow: Each year, determine the net cash flow, which accounts for fresh capital added or funds withdrawn by the investors. This is done by subtracting the ending portfolio value from the AUM of the following year.

5.Set up the IRR equation: Once the cash flows for each year are determined, set up the equation for the Internal Rate of Return (IRR). Remember, the IRR can be considered the annual growth rate that makes an investment break even. In other words, it's the rate at which the present value of an investment's future cash flows equals the cost of the investment.

6.Solve for IRR: Calculating the IRR manually can be time-consuming and ineffective because it requires trial and error. Instead, use a computational tool like Excel's IRR function, which automatically calculates the IRR given a range of cash flows.

Sanity Check: The cash flows in Years 0 and 1 are -\$75 million and -\$15 million, respectively.

To obtain the time-weighted rate of return, you need to perform the following steps:

1. Break the investment horizon of the five years into smaller evaluation periods and geometrically ‘link’ them.

The holding period return in Year 1 is equal to the following: 

\[{HPR}_{Year\ 1}=\frac{$90mn-$75mn}{$75mn}=0.2=20\%\]

Note that this is the net return in Year 1.

2. Similarly, use the other net returns and substitute them in the formula for calculating geometric mean return:

\[{\overline{R}}_{Gi}=\sqrt[T]{\left(1+R_{i1}\right)\times\left(1+R_{i2}\right)\ldots\times\left(1+R_{i,T-1}\right)\times\left(1+R_{i,T}\right)}-1=\sqrt[T]{\prod_{t=1}^{T}{(1+R_{it)}}}-1\]

Note that you can speed up the process using Excel’s GEOMEAN function. 