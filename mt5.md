# BistaFX — MetaTrader 5 Trade Journal Integration

## 1. Overview

The BistaFX website must allow traders to connect their MetaTrader trading account and view a complete trading journal directly inside the website dashboard.

The system will retrieve and display trading data including:

- Full trade history
- Open trades
- Closed trades
- Profit/loss statistics
- Equity curve
- Performance analytics

The integration will use **read-only authentication via the investor password** from MetaTrader 5.

This ensures users can safely share access without giving trading permissions.

---

## 2. User Flow

### Step 1 — Login to Dashboard

User logs into their BistaFX account.

### Step 2 — Connect MetaTrader

User clicks **Connect Trading Account**.

A connection form appears with the following fields:

- **Account Number**
- **Investor Password**
- **Server Name**

Example:

```
Account Number: 12345678
Investor Password: ********
Server: OANDA-Live
```

The system connects to the user's trading account hosted by OANDA.

### Step 3 — Data Sync

Backend retrieves data from MetaTrader terminal API.

Fetched data includes:

- Trade history
- Open positions
- Closed trades
- Profit/loss
- Commissions
- Swap
- Trade duration
- Symbol traded
- Lot size
- Account balance
- Equity

### Step 4 — Dashboard Display

Users can view their trading analytics in the **Trade Journal Dashboard**.

---

## 3. Trade Journal Dashboard

### Page Layout

#### 1. Performance Summary

Metrics displayed:

- Total Trades
- Win Rate
- Total Profit
- Average Risk Reward
- Profit Factor
- Max Drawdown

#### 2. Equity Curve Chart

Interactive chart showing account equity over time.

Chart features:

- Zoom
- Date filtering
- Profit visualization

#### 3. Trade History Table

Full trade history display.

| Pair   | Lot  | Entry Price | Exit Price | Profit | Duration |
|--------|------|-------------|------------|--------|----------|
| EURUSD | 0.50 | 1.0812      | 1.0845     | +$165  | 2h       |

Columns:

- Symbol
- Lot Size
- Entry Price
- Exit Price
- Profit/Loss
- Trade Duration
- Open Time
- Close Time

#### 4. Trade Analytics

Additional insights:

- Most traded pair
- Average trade duration
- Profit per symbol
- Win rate per pair

---

## 4. Technical Architecture

The system must use a backend bridge connected to MetaTrader terminal software.

```
User Browser
    |
BistaFX Website
    |
Backend API Server
    |
MetaTrader Terminal
    |
MetaTrader Python API
    |
Trading Data
```

The backend retrieves trading data using the official MetaTrader Python integration library.

---

## 5. Security Requirements

Security is critical when connecting trading accounts.

**Rules:**

The system must only request the **Investor Password**. Never request the Master Password.

Investor password provides:

- Read-only access
- Trade history
- Account statistics

Investor password does NOT allow:

- Trade execution
- Withdrawals
- Account modifications

---

## 6. Data Storage

Trade data should be cached temporarily to reduce API calls.

Suggested storage:

- **PostgreSQL** — persistent storage
- **Redis** — short-term caching

Data refresh frequency:

- Every 5 minutes
- Or manual refresh by user

---

## 7. UI Requirements

The trade journal should look similar to professional trading analytics platforms.

**Design references:**

- Myfxbook
- FTMO dashboards

**Key UI characteristics:**

- Clean financial dashboard
- Dark theme preferred
- Structured data tables
- Professional charts

**Avoid:**

- Overly colorful graphics
- Cartoon icons
- Crypto-style UI

---

## 8. Future Enhancements (Phase 2)

- Automatic trade sync
- Trading performance scoring
- Risk analysis
- Daily trading reports
- Downloadable trade reports (CSV/PDF)
- Portfolio comparison

---

## 9. Success Criteria

The feature is successful when:

- Users can connect their MetaTrader account easily.
- The dashboard displays complete trade history, accurate performance statistics, and real-time trading analytics.
- The system must appear professional, fast, and reliable, similar to institutional trading analytics platforms.
