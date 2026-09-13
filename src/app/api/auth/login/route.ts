import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Username dan password wajib diisi" },
        { status: 400 }
      );
    }

    const identifier = (email || "").toLowerCase().trim();

    const admin = await prisma.admin.findFirst({
      where: {
        OR: [
          { email: identifier },
          { email: `${identifier}@nadhirah.com` },
        ],
      },
    });

    if (!admin) {
      return NextResponse.json(
        { error: "Username atau kata sandi tidak sesuai" },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Username atau kata sandi tidak sesuai" },
        { status: 401 }
      );
    }

    await createSession({
      adminId: admin.id,
      email: admin.email,
      role: admin.role,
    });

    return NextResponse.json({ success: true, role: admin.role });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Terjadi kendala saat proses login" },
      { status: 500 }
    );
  }
}
