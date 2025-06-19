/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import {
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  ChevronRightSquare,
  Search,
  X,
} from "lucide-react";

type OrderItem = {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image_url: string | null;
};

type Order = {
  id: string;
  customer_name: string;
  email: string;
  phone?: string;
  total: number;
  status: string;
  created_at: string;
  fulfilled_at?: string;
  notes?: string;
  admin_notes?: string;
  address?: string | Record<string, any>;
  order_items?: OrderItem[];
};

const STATUS_STYLES: Record<string, string> = {
  fulfilled:
    "bg-[var(--cake-mint)]/60 text-[var(--cake-brown)] border-[var(--cake-mint)]",
  pending:
    "bg-[var(--cake-yellow)]/70 text-[var(--cake-brown)] border-[var(--cake-yellow)]",
  canceled: "bg-red-200 text-[var(--cake-brown)] border-red-300",
};

const PAGE_SIZES = [10, 25, 50];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<{ [id: string]: boolean }>({});
  const [showFulfilled, setShowFulfilled] = useState(false);

  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [totalCount, setTotalCount] = useState(0);

  // Polished search
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  // Filter
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  // Pagination logic
  const pageCount = Math.max(1, Math.ceil(totalCount / pageSize));

  // Debounce search input
  useEffect(() => {
    const timeout = setTimeout(() => setSearch(searchInput), 300);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  // Fetch paginated orders
  useEffect(() => {
    setLoading(true);

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from("orders")
      .select(
        `
        *,
        order_items (
          id,
          name,
          quantity,
          price,
          image_url
        )
      `,
        { count: "exact" }
      )
      .order("created_at", { ascending: false })
      .range(from, to);

    if (statusFilter) {
      query = query.eq("status", statusFilter);
    } else {
      query = query.eq("status", showFulfilled ? "fulfilled" : "pending");
    }

    // Search
    if (search) {
      query = query.or(
        `customer_name.ilike.%${search}%,email.ilike.%${search}%`
      );
      if (page !== 1) setPage(1);
    }

    query.then(({ data, error, count }) => {
      if (!error && data) {
        setOrders(data as Order[]);
        setTotalCount(count ?? 0);
      }
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, statusFilter, showFulfilled, search]);

  function StatusPill({ status }: { status: string }) {
    return (
      <span
        className={`inline-block px-2 py-1 rounded text-xs font-semibold border ${
          STATUS_STYLES[status] || "bg-gray-200 border-gray-300 text-gray-600"
        }`}
      >
        {status}
      </span>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-2 sm:p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-4 sm:mb-6 text-[var(--cake-brown)]">
        Orders
      </h1>

      {/* Polished Search & Filter */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 mb-4">
        {/* Polished Search */}
        <div className="relative w-full md:w-72">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--cake-brown)] opacity-70 pointer-events-none"
            aria-hidden
          />
          <input
            ref={searchRef}
            type="text"
            placeholder="Search by name or email…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-10 pr-9 py-2 rounded border border-gray-200 shadow w-full focus:ring-2 focus:ring-[var(--cake-pink)] focus:border-[var(--cake-pink)] transition-colors text-sm outline-none"
          />
          {!!searchInput && (
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-[var(--cake-yellow)]/30 transition"
              onClick={() => {
                setSearchInput("");
                searchRef.current?.focus();
              }}
              tabIndex={-1}
              aria-label="Clear search"
            >
              <X className="w-4 h-4 text-[var(--cake-brown)] opacity-70" />
            </button>
          )}
        </div>
        {/* Status filter */}
        <div className="flex gap-2">
          {["pending", "fulfilled", "canceled"].map((status) => (
            <button
              key={status}
              onClick={() =>
                setStatusFilter(statusFilter === status ? null : status)
              }
              className={`px-3 py-1 rounded-xl text-xs font-semibold border transition
                ${
                  statusFilter === status
                    ? status === "fulfilled"
                      ? "bg-[var(--cake-mint)]/70 text-[var(--cake-brown)] border-[var(--cake-mint)]"
                      : status === "pending"
                      ? "bg-[var(--cake-yellow)]/80 text-[var(--cake-brown)] border-[var(--cake-yellow)]"
                      : "bg-red-200 text-[var(--cake-brown)] border-red-300"
                    : "bg-white border-gray-200 text-gray-400"
                }
              `}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
          {statusFilter && (
            <button
              onClick={() => setStatusFilter(null)}
              className="ml-2 text-xs underline text-gray-400"
            >
              Clear
            </button>
          )}
        </div>
        <div className="flex gap-2 ml-auto">
          <label className="text-xs text-[var(--cake-brown)] mt-2 hidden sm:inline">
            Page size:
          </label>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="py-1 px-2 rounded border text-xs shadow"
          >
            {PAGE_SIZES.map((size) => (
              <option key={size} value={size}>
                {size} per page
              </option>
            ))}
          </select>
        </div>
      </div>
      {/* Result count feedback */}
      {search && (
        <div className="text-xs text-[var(--cake-brown)] ml-1 mt-1 mb-2">
          {orders.length
            ? `Found ${orders.length} order${orders.length !== 1 ? "s" : ""}`
            : "No matching orders"}
        </div>
      )}

      {/* Fulfilled / Unfulfilled Switch */}
      <div className="flex items-center gap-2 mb-2">
        <button
          className={`px-3 py-1 rounded-xl text-sm font-semibold transition border
            ${
              !showFulfilled
                ? "bg-[var(--cake-yellow)]/80 text-[var(--cake-brown)] border-[var(--cake-yellow)]"
                : "bg-white border-gray-200 text-gray-400"
            }`}
          onClick={() => {
            setShowFulfilled(false);
            setStatusFilter(null);
            setPage(1);
          }}
        >
          Unfulfilled
        </button>
        <button
          className={`px-3 py-1 rounded-xl text-sm font-semibold transition border
            ${
              showFulfilled
                ? "bg-[var(--cake-mint)]/60 text-[var(--cake-brown)] border-[var(--cake-mint)]"
                : "bg-white border-gray-200 text-gray-400"
            }`}
          onClick={() => {
            setShowFulfilled(true);
            setStatusFilter(null);
            setPage(1);
          }}
        >
          Fulfilled
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl shadow border border-gray-100 bg-white">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-[var(--cake-brown)] border-b">
              <th className="py-3 px-2"></th>
              <th className="py-3 px-2">Order #</th>
              <th className="py-3 px-2">Customer</th>
              <th className="py-3 px-2 hidden sm:table-cell">Total</th>
              <th className="py-3 px-2">Status</th>
              <th className="py-3 px-2 hidden sm:table-cell">Date</th>
              <th className="py-3 px-2"></th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-12 text-xl opacity-60"
                >
                  Loading orders…
                </td>
              </tr>
            )}
            {!loading && orders.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-12 opacity-60">
                  No orders found.
                </td>
              </tr>
            )}
            {!loading &&
              orders.map((order) => (
                <React.Fragment key={order.id}>
                  <tr
                    className={`border-b hover:bg-[var(--cake-yellow)]/10 transition ${
                      expanded[order.id] ? "bg-[var(--cake-mint)]/10" : ""
                    }`}
                  >
                    <td className="py-2 px-2">
                      <button
                        aria-label={
                          expanded[order.id]
                            ? "Collapse order items"
                            : "Expand order items"
                        }
                        className="focus:outline-none"
                        onClick={() =>
                          setExpanded((prev) => ({
                            ...prev,
                            [order.id]: !prev[order.id],
                          }))
                        }
                      >
                        {expanded[order.id] ? (
                          <ChevronDown className="w-5 h-5" />
                        ) : (
                          <ChevronRight className="w-5 h-5" />
                        )}
                      </button>
                    </td>
                    <td className="py-2 px-2 font-mono text-xs sm:text-sm">
                      {order.id.slice(0, 8)}
                    </td>
                    <td className="py-2 px-2">
                      {order.customer_name || order.email}
                    </td>
                    <td className="py-2 px-2 hidden sm:table-cell">
                      ${order.total.toFixed(2)}
                    </td>
                    <td className="py-2 px-2">
                      <StatusPill status={order.status} />
                    </td>
                    <td className="py-2 px-2 hidden sm:table-cell">
                      {order.created_at
                        ? new Date(order.created_at)
                            .toISOString()
                            .replace("T", " ")
                            .slice(0, 16)
                        : ""}
                    </td>
                    <td className="py-2 px-2">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-[var(--cake-pink)] underline hover:text-[var(--cake-mint)]"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                  {expanded[order.id] && (
                    <tr>
                      <td colSpan={7} className="bg-transparent">
                        <div className="p-4 bg-[var(--cake-mint)]/10 rounded-xl shadow-inner animate-fade-in">
                          <h3 className="font-bold text-[var(--cake-brown)] mb-3">
                            Order Items
                          </h3>
                          <ul className="space-y-4">
                            {(() => {
                              const items = Array.isArray(order.order_items)
                                ? order.order_items
                                : [];
                              return items.length > 0 ? (
                                items.map((item, idx) => (
                                  <li
                                    key={item.id}
                                    className="flex items-center gap-4 relative pb-4"
                                  >
                                    {item.image_url && (
                                      <div className="relative w-14 h-14 shrink-0">
                                        <Image
                                          src={item.image_url}
                                          alt={item.name}
                                          fill
                                          className="rounded-xl object-cover border"
                                          sizes="56px"
                                          priority={idx === 0}
                                        />
                                      </div>
                                    )}
                                    <div className="flex-1">
                                      <div className="font-semibold">
                                        {item.name}
                                      </div>
                                      <div className="text-sm opacity-70">
                                        Quantity: {item.quantity}
                                      </div>
                                    </div>
                                    <div className="font-bold text-[var(--cake-brown)]">
                                      ${(item.price * item.quantity).toFixed(2)}
                                    </div>
                                    {idx < items.length - 1 && (
                                      <div
                                        className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[90%] h-px bg-[var(--cake-brown)]/20"
                                        aria-hidden="true"
                                      />
                                    )}
                                  </li>
                                ))
                              ) : (
                                <div className="opacity-50 text-sm">
                                  No items found for this order.
                                </div>
                              );
                            })()}
                          </ul>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
          </tbody>
        </table>
      </div>
      {/* Pagination controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-2">
        <span className="text-xs opacity-80 mb-2 sm:mb-0">
          Showing {orders.length} of {totalCount} orders
        </span>
        <div className="flex items-center gap-2">
          <button
            className="p-2 rounded border bg-white shadow hover:bg-[var(--cake-mint)]/20"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            aria-label="Previous Page"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          {[...Array(pageCount).keys()].map((i) =>
            i + 1 === page ||
            i + 1 === 1 ||
            i + 1 === pageCount ||
            Math.abs(i + 1 - page) < 2 ? (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 rounded ${
                  page === i + 1
                    ? "bg-[var(--cake-pink)] text-[var(--cake-brown)] font-bold"
                    : "bg-white text-[var(--cake-brown)] hover:bg-[var(--cake-yellow)]/30"
                }`}
              >
                {i + 1}
              </button>
            ) : (
              (i + 2 === page || i === page) && (
                <span key={i} className="px-2 text-gray-400">
                  …
                </span>
              )
            )
          )}
          <button
            className="p-2 rounded border bg-white shadow hover:bg-[var(--cake-mint)]/20"
            onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
            disabled={page === pageCount}
            aria-label="Next Page"
          >
            <ChevronRightSquare className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
