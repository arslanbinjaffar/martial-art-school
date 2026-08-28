import React, { useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  fontFamilyBold,
  fontFamilyMedium,
  lightBlue3,
  primaryColor,
  pureDark,
  whiteColor,
} from "../../components/GlobalStyle";
import CustomButton from "../../components/CustomButton/CustomButton";
import Head from "../../components/Head/Head";

const Membership = () => {
  const navigate = useNavigate();
  const [selectedBillingCycle, setSelectedBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [activePlanId, setActivePlanId] = useState<number>(2);

  const plans = [
    {
      id: 1,
      name: "Starter Dojo Pass",
      badge: "Beginner",
      priceMonthly: 49,
      priceYearly: 490,
      description: "Ideal for new practitioners starting their martial arts journey.",
      features: [
        "2 Classes per week",
        "Access to White & Yellow Belt curriculum",
        "Basic Dojo facility access",
        "Community chat & event updates",
        "Standard uniform discount (5%)",
      ],
      popular: false,
    },
    {
      id: 2,
      name: "Unlimited Warrior",
      badge: "Most Popular",
      priceMonthly: 89,
      priceYearly: 890,
      description: "Full unlimited access to all daily martial arts disciplines & sparring.",
      features: [
        "Unlimited classes in Karate, BJJ & Muay Thai",
        "Belt grading eligibility & exam vouchers",
        "Open mat sparring sessions",
        "Gym & conditioning zone access",
        "1 Free 1-on-1 coaching session / month",
        "15% Pro Shop gear discount",
      ],
      popular: true,
    },
    {
      id: 3,
      name: "Black Belt Elite",
      badge: "Master / VIP",
      priceMonthly: 149,
      priceYearly: 1490,
      description: "Master level training with direct Grandmaster mentorship & competitions.",
      features: [
        "All Unlimited Warrior benefits",
        "Weekly private coaching with Master Trainer",
        "National tournament registration sponsorship",
        "VIP locker room & recovery sauna access",
        "Free official Gi & competition fight kit",
        "24/7 Dojo digital masterclass library",
      ],
      popular: false,
    },
  ];

  const handleSubscribe = (plan: typeof plans[0]) => {
    setActivePlanId(plan.id);
    toast.success(`Selected ${plan.name} (${selectedBillingCycle} billing)`);
    navigate("/payment");
  };

  return (
    <MembershipStyled>
      <Head title="Membership Plans" />
      <Container fluid className="py-4 px-md-4">
        <div className="text-center mb-5">
          <h1 className="page-title">🥋 Membership & Training Plans</h1>
          <p className="page-subtitle">
            Choose the best plan to level up your martial arts training, belt rank, and combat fitness.
          </p>

          <div className="billing-toggle mt-4">
            <button
              type="button"
              className={`toggle-btn ${selectedBillingCycle === "monthly" ? "active" : ""}`}
              onClick={() => setSelectedBillingCycle("monthly")}
            >
              Monthly Billing
            </button>
            <button
              type="button"
              className={`toggle-btn ${selectedBillingCycle === "yearly" ? "active" : ""}`}
              onClick={() => setSelectedBillingCycle("yearly")}
            >
              Yearly Billing <span className="discount-tag">Save 20%</span>
            </button>
          </div>
        </div>

        <Row className="g-4 justify-content-center">
          {plans.map((plan) => {
            const price = selectedBillingCycle === "monthly" ? plan.priceMonthly : plan.priceYearly;
            const isCurrent = activePlanId === plan.id;

            return (
              <Col key={plan.id} lg={4} md={6} sm={12}>
                <Card className={`plan-card ${plan.popular ? "featured" : ""} ${isCurrent ? "current" : ""}`}>
                  {plan.popular && <div className="featured-ribbon">⭐ Most Popular</div>}
                  <Card.Body className="p-4 d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h3 className="plan-name">{plan.name}</h3>
                      <span className="plan-badge">{plan.badge}</span>
                    </div>
                    <p className="plan-desc">{plan.description}</p>

                    <div className="price-tag my-3">
                      <span className="currency">$</span>
                      <span className="amount">{price}</span>
                      <span className="period">/{selectedBillingCycle === "monthly" ? "mo" : "yr"}</span>
                    </div>

                    <hr className="divider" />

                    <h5 className="features-title">What's included:</h5>
                    <ul className="features-list flex-grow-1">
                      {plan.features.map((feat, idx) => (
                        <li key={idx}>
                          <span className="check-icon">✓</span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-4">
                      <CustomButton
                        title={isCurrent ? "Current Plan" : "Choose Plan"}
                        clicked={() => handleSubscribe(plan)}
                        bgcolor={plan.popular ? lightBlue3 : primaryColor}
                        color={plan.popular ? pureDark : whiteColor}
                        width="100%"
                        padding="12px"
                        fontSize="16px"
                        fontFamily={fontFamilyBold}
                      />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </MembershipStyled>
  );
};

export default Membership;

const MembershipStyled = styled.div`
  min-height: 80vh;
  background: #f8fafc;

  .page-title {
    font-size: 32px;
    font-family: ${fontFamilyBold};
    color: #1e293b;
    margin-bottom: 8px;
  }

  .page-subtitle {
    font-size: 16px;
    color: #64748b;
    max-width: 600px;
    margin: 0 auto;
  }

  .billing-toggle {
    display: inline-flex;
    background: #e2e8f0;
    padding: 4px;
    border-radius: 9999px;

    .toggle-btn {
      border: none;
      background: transparent;
      padding: 8px 20px;
      font-size: 14px;
      font-family: ${fontFamilyMedium};
      color: #64748b;
      border-radius: 9999px;
      cursor: pointer;
      transition: all 0.2s ease;

      &.active {
        background: #ffffff;
        color: #0f172a;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
      }

      .discount-tag {
        background: #10b981;
        color: white;
        font-size: 11px;
        padding: 2px 8px;
        border-radius: 10px;
        margin-left: 6px;
      }
    }
  }

  .plan-card {
    border-radius: 20px;
    border: 1px solid #e2e8f0;
    background: #ffffff;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.04);
    height: 100%;
    position: relative;
    overflow: hidden;
    transition: transform 0.2s ease, box-shadow 0.2s ease;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 25px rgba(0, 0, 0, 0.08);
    }

    &.featured {
      border: 2px solid ${lightBlue3};
      box-shadow: 0 8px 30px rgba(56, 189, 248, 0.2);
    }

    &.current {
      border-color: #10b981;
    }

    .featured-ribbon {
      background: ${lightBlue3};
      color: #0f172a;
      text-align: center;
      font-size: 12px;
      font-family: ${fontFamilyBold};
      padding: 4px 0;
      letter-spacing: 0.5px;
    }

    .plan-name {
      font-size: 20px;
      font-family: ${fontFamilyBold};
      color: #0f172a;
      margin: 0;
    }

    .plan-badge {
      background: #f1f5f9;
      color: #475569;
      font-size: 12px;
      padding: 4px 10px;
      border-radius: 20px;
      font-family: ${fontFamilyMedium};
    }

    .plan-desc {
      font-size: 13px;
      color: #64748b;
      margin-bottom: 0;
      min-height: 38px;
    }

    .price-tag {
      .currency {
        font-size: 22px;
        color: #0f172a;
        vertical-align: top;
        font-family: ${fontFamilyBold};
      }
      .amount {
        font-size: 42px;
        color: #0f172a;
        font-family: ${fontFamilyBold};
        line-height: 1;
      }
      .period {
        font-size: 14px;
        color: #64748b;
      }
    }

    .divider {
      border-color: #f1f5f9;
      margin: 12px 0 16px 0;
    }

    .features-title {
      font-size: 14px;
      font-family: ${fontFamilyBold};
      color: #334155;
      margin-bottom: 12px;
    }

    .features-list {
      list-style: none;
      padding: 0;
      margin: 0;

      li {
        display: flex;
        align-items: flex-start;
        font-size: 13px;
        color: #475569;
        margin-bottom: 10px;

        .check-icon {
          color: #10b981;
          font-weight: bold;
          margin-right: 10px;
          background: #ecfdf5;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          flex-shrink: 0;
        }
      }
    }
  }
`;
